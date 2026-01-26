"""
3-Day AQI Forecast using XGBoost Model
Predicts next 72 hours using recursive forecasting
"""
import sys
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
import xgboost as xgb
from datetime import datetime, timedelta

import os
from .aqi_calculator import compute_aqi_for_dataframe, get_aqi_category
# Import API Client
try:
    from .api_client import MultiSourceAPIClient
except ImportError:
    MultiSourceAPIClient = None

# Configuration - must match training
LAG_HOURS = [1, 3, 6, 12, 24]
ROLLING_WINDOWS = [3, 6, 12, 24]

def load_model():
    """Load trained model and components."""
    models_dir = Path(__file__).parent / 'models'
    
    model = xgb.XGBRegressor()
    model.load_model(str(models_dir / 'xgboost_aqi.json'))
    scaler = joblib.load(models_dir / 'scaler.pkl')
    feature_names = joblib.load(models_dir / 'feature_names.pkl')
    
    print('Model loaded successfully!')
    return model, scaler, feature_names


def prepare_historical_data():
    """Load and prepare historical data."""
    # Data is now in ml_engine/data
    df = pd.read_csv(Path(__file__).parent / 'data' / 'delhi_model_data.csv')
    df['Datetime'] = pd.to_datetime(df['Datetime'])
    df = df.sort_values('Datetime')
    
    # Compute AQI
    df = compute_aqi_for_dataframe(df)
    
    # Add temporal features
    df['hour'] = df['Datetime'].dt.hour
    df['day_of_week'] = df['Datetime'].dt.dayofweek
    df['month'] = df['Datetime'].dt.month
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    
    return df


def fetch_and_merge_live_data(historical_df):
    """
    Fetch real-time data and merge with historical data.
    """
    if MultiSourceAPIClient is None:
        print("API Client not available.")
        return historical_df
        
    # Get keys from env (already loaded by main.py or load here)
    # Since this is a module, we assume env is loaded or we check os.environ
    owm_key = os.getenv("OPENWEATHERMAP_API_KEY")
    openaq_key = os.getenv("OPENAQ_API_KEY")
    cpcb_key = os.getenv("CPCB_API_KEY")
    
    # Initialize client
    client = MultiSourceAPIClient(
        openweathermap_key=owm_key, 
        openaq_key=openaq_key,
        cpcb_key=cpcb_key
    )
    
    # Fetch last 48 hours for context
    live_df = client.fetch_realtime_data(city='Delhi', hours=48)
    
    if live_df is None or len(live_df) == 0:
        print("No live data fetched. Using historical only.")
        return historical_df
        
    print(f"Merging {len(live_df)} live records...")
    
    # Ensure Datetime is timezone-naive or matching
    live_df['Datetime'] = pd.to_datetime(live_df['Datetime']).dt.tz_localize(None)
    historical_df['Datetime'] = pd.to_datetime(historical_df['Datetime']).dt.tz_localize(None)
    
    # Combine
    # We want to keep historical data but overwrite overlapping periods with fresher data if available?
    # Or just append fresh data that is NEWER than historical?
    
    last_hist_date = historical_df['Datetime'].max()
    print(f"Historical data ends at: {last_hist_date}")
    
    # Filter live data to be after historical (or just cutoff at some point)
    # Actually, if historical is old (Nov 2025), and live is New (Jan 2026), there is a gap.
    # The model needs a continuous sequence for lag features.
    # If there is a massive gap, lags will be wrong (referencing Nov for Jan prediction).
    # Ideally we need a full recent history.
    # But for this demo, if we have a gap, we might just use the Live Data Chunk as the new 'history'
    # providing it has enough rows (e.g. > 24h) for feature engineering.
    
    if len(live_df) >= 24:
        print("Live data duration > 24h. Using Live Data as primary context (skipping gap).")
        # We assume standard features can be computed on live_df
        combined_df = live_df.copy()
    else:
        print("Live data < 24h. Appending to historical (gap may affect accuracy).")
        combined_df = pd.concat([historical_df, live_df]).drop_duplicates(subset=['Datetime']).sort_values('Datetime')
    
    return combined_df

def prepare_historical_data():
    """Load and prepare historical and live data."""
    # Data is now in ml_engine/data
    df = pd.read_csv(Path(__file__).parent / 'data' / 'delhi_model_data.csv')
    df['Datetime'] = pd.to_datetime(df['Datetime'])
    df = df.sort_values('Datetime')
    
    # --- Live Data Integration ---
    try:
        df = fetch_and_merge_live_data(df)
    except Exception as e:
        print(f"Error merging live data: {e}")
    # -----------------------------
    
    # Compute AQI (re-compute for new data)
    df = compute_aqi_for_dataframe(df)
    
    # Add temporal features
    df['hour'] = df['Datetime'].dt.hour
    df['day_of_week'] = df['Datetime'].dt.dayofweek
    df['month'] = df['Datetime'].dt.month
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    
    return df


def get_rolling_stats(aqi_history, window):
    """Calculate rolling statistics from history."""
    if len(aqi_history) < window:
        arr = aqi_history
    else:
        arr = aqi_history[-window:]
    
    return {
        'mean': np.mean(arr),
        'std': np.std(arr) if len(arr) > 1 else 0,
        'max': np.max(arr),
        'min': np.min(arr)
    }


def forecast_next_hours(model, scaler, feature_names, df, hours=72):
    """Forecast AQI for next N hours using recursive prediction."""
    
    # Get the last known data point
    last_row = df.iloc[-1].copy()
    last_datetime = last_row['Datetime']
    
    # Build AQI history (last 24 hours)
    aqi_history = df['AQI_computed'].tail(24).tolist()
    
    # Get last known pollutant values (we'll assume they persist with slight variation)
    pollutant_cols = ['PM2_5_ugm3', 'PM10_ugm3', 'NO2_ugm3', 'CO_ugm3', 'O3_ugm3', 'SO2_ugm3',
                      'Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh']
    last_pollutants = {col: last_row[col] for col in pollutant_cols if col in df.columns}
    
    forecasts = []
    
    print(f'\nForecasting from: {last_datetime}')
    print(f'Last known AQI: {aqi_history[-1]:.1f}')
    print('-' * 60)
    
    for h in range(1, hours + 1):
        # Calculate future datetime
        future_dt = last_datetime + timedelta(hours=h)
        
        # Create feature row
        features = {}
        
        # Pollutant features (use last known with slight diurnal variation)
        hour_of_day = future_dt.hour
        
        # Simple diurnal pattern: pollution higher in morning/evening rush hours
        if hour_of_day in [7, 8, 9, 18, 19, 20]:
            pollution_factor = 1.1
        elif hour_of_day in [2, 3, 4, 5]:
            pollution_factor = 0.9
        else:
            pollution_factor = 1.0
        
        for col, val in last_pollutants.items():
            if col in ['Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh']:
                features[col] = val  # Keep weather same
            else:
                features[col] = val * pollution_factor
        
        # Temporal features
        features['hour'] = hour_of_day
        features['day_of_week'] = future_dt.weekday()
        features['month'] = future_dt.month
        features['is_weekend'] = 1 if future_dt.weekday() >= 5 else 0
        features['hour_sin'] = np.sin(2 * np.pi * hour_of_day / 24)
        features['hour_cos'] = np.cos(2 * np.pi * hour_of_day / 24)
        features['month_sin'] = np.sin(2 * np.pi * future_dt.month / 12)
        features['month_cos'] = np.cos(2 * np.pi * future_dt.month / 12)
        
        # Lag features (from AQI history)
        for lag in LAG_HOURS:
            if lag <= len(aqi_history):
                features[f'AQI_computed_lag_{lag}h'] = aqi_history[-lag]
            else:
                features[f'AQI_computed_lag_{lag}h'] = aqi_history[0]
        
        # Rolling features
        for window in ROLLING_WINDOWS:
            stats = get_rolling_stats(aqi_history, window)
            features[f'AQI_computed_rolling_mean_{window}h'] = stats['mean']
            features[f'AQI_computed_rolling_std_{window}h'] = stats['std']
            features[f'AQI_computed_rolling_max_{window}h'] = stats['max']
            features[f'AQI_computed_rolling_min_{window}h'] = stats['min']
        
        # Create feature vector in correct order
        X = np.array([[features.get(f, 0) for f in feature_names]])
        
        # Scale and predict
        X_scaled = scaler.transform(X)
        predicted_aqi = model.predict(X_scaled)[0]
        
        # Post-process: Apply explicit diurnal variation and noise to prevent flatlining
        # (The ML model alone might be too stable/conservative)
        predicted_aqi = predicted_aqi * pollution_factor * (1.0 + np.random.uniform(-0.02, 0.02))
        
        # Clip to valid AQI range
        predicted_aqi = np.clip(predicted_aqi, 0, 500)
        
        # Update AQI history for next prediction
        aqi_history.append(predicted_aqi)
        if len(aqi_history) > 48:  # Keep last 48 hours
            aqi_history.pop(0)
        
        # Get category
        category, color = get_aqi_category(predicted_aqi)
        
        forecasts.append({
            'datetime': future_dt,
            'hour': int(h),
            'predicted_aqi': float(predicted_aqi),
            'category': str(category)
        })
    
    return forecasts


def print_forecast_summary(forecasts):
    """Print formatted forecast summary."""
    
    print('\n' + '=' * 70)
    print('3-DAY AQI FORECAST FOR DELHI')
    print('=' * 70)
    
    # Group by day
    forecast_df = pd.DataFrame(forecasts)
    forecast_df['date'] = forecast_df['datetime'].dt.date
    
    # Daily summary
    print('\nDAILY SUMMARY:')
    print('-' * 50)
    
    for date, group in forecast_df.groupby('date'):
        avg_aqi = group['predicted_aqi'].mean()
        max_aqi = group['predicted_aqi'].max()
        min_aqi = group['predicted_aqi'].min()
        category, _ = get_aqi_category(avg_aqi)
        
        day_name = pd.Timestamp(date).strftime('%A, %B %d')
        
        print(f'\n{day_name}')
        print(f'  Average AQI: {avg_aqi:.0f} ({category})')
        print(f'  Range: {min_aqi:.0f} - {max_aqi:.0f}')
        
        # Find peak hours
        peak_idx = group['predicted_aqi'].idxmax()
        peak_hour = group.loc[peak_idx, 'datetime'].strftime('%H:%M')
        print(f'  Peak at: {peak_hour} (AQI: {max_aqi:.0f})')
    
    # Hourly forecast table
    print('\n' + '=' * 70)
    print('HOURLY FORECAST:')
    print('=' * 70)
    print(f'\n{"DateTime":<20} {"AQI":>8} {"Category":<15}')
    print('-' * 50)
    
    prev_date = None
    for f in forecasts:
        dt = f['datetime']
        date_str = dt.strftime('%Y-%m-%d')
        
        # Print date header
        if date_str != prev_date:
            print(f'\n--- {dt.strftime("%A, %B %d, %Y")} ---')
            prev_date = date_str
        
        time_str = dt.strftime('%H:%M')
        aqi = f['predicted_aqi']
        category = f['category']
        
        # Color indicator based on AQI
        if aqi <= 50:
            indicator = '[GOOD]'
        elif aqi <= 100:
            indicator = '[SATISFACTORY]'
        elif aqi <= 200:
            indicator = '[MODERATE]'
        elif aqi <= 300:
            indicator = '[POOR]'
        elif aqi <= 400:
            indicator = '[VERY POOR]'
        else:
            indicator = '[SEVERE]'
        
        print(f'{time_str:<20} {aqi:>8.0f} {indicator:<15}')
    
    # Health advisory
    avg_overall = np.mean([f['predicted_aqi'] for f in forecasts])
    print('\n' + '=' * 70)
    print('HEALTH ADVISORY:')
    print('=' * 70)
    
    if avg_overall <= 100:
        print('Air quality expected to be SATISFACTORY.')
        print('Normal outdoor activities can be continued.')
    elif avg_overall <= 200:
        print('Air quality expected to be MODERATE.')
        print('Sensitive groups should limit prolonged outdoor exertion.')
    elif avg_overall <= 300:
        print('Air quality expected to be POOR.')
        print('Everyone should reduce prolonged outdoor exertion.')
        print('Sensitive groups should stay indoors.')
    else:
        print('Air quality expected to be VERY POOR to SEVERE.')
        print('AVOID outdoor activities. Use air purifiers indoors.')
        print('Wear N95 masks if going outside is necessary.')
    
    print('=' * 70)


def main():
    print('\n' + '=' * 70)
    print('XGBOOST AQI MODEL - 3 DAY FORECAST')
    print('=' * 70)
    
    # Load model
    model, scaler, feature_names = load_model()
    
    # Prepare historical data
    print('\nLoading historical data...')
    df = prepare_historical_data()
    print(f'Data loaded: {len(df)} records')
    print(f'Date range: {df["Datetime"].min()} to {df["Datetime"].max()}')
    
    # Generate forecast
    forecasts = forecast_next_hours(model, scaler, feature_names, df, hours=72)
    
    # Print results
    print_forecast_summary(forecasts)


if __name__ == '__main__':
    main()
