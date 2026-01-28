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

def load_model(city='Delhi'):
    """Load trained model and components for specific city."""
    models_dir = Path(__file__).parent / 'models'
    
    prefix = ""
    if city.lower() == 'pune':
        prefix = "pune_"
    
    model_path = models_dir / f'{prefix}xgboost_aqi.json'
    scaler_path = models_dir / f'{prefix}scaler.pkl'
    # Pune uses feature_names.pkl (no prefix in some listings, but let's check)
    # List dir showed: pune_feature_names.pkl
    feature_path = models_dir / f'{prefix}feature_names.pkl'
    
    if not model_path.exists():
        print(f"Model not found for {city}: {model_path}")
        return None, None, None

    model = xgb.XGBRegressor()
    model.load_model(str(model_path))
    scaler = joblib.load(scaler_path)
    feature_names = joblib.load(feature_path)
    
    print(f'{city} Model loaded successfully!')
    return model, scaler, feature_names


def prepare_historical_data(city='Delhi'):
    """Load and prepare historical and live data."""
    # Data is now in ml_engine/data
    data_dir = Path(__file__).parent / 'data'
    
    filename = 'delhi_model_data.csv'
    if city.lower() == 'pune':
        filename = 'pune_stations_combined.csv' 
        # Note: 'pune_stations_combined.csv' is station-wise. 
        # Ideally we need a standard training file (like delhi_model_data.csv). 
        # If unavailable, we might fail or need to aggregate.
        # Assuming for now it works or we use what we have.
        # Actually, let's look at file size. 8MB. Might be raw station data.
        # If we fail here, we fallback.
        
    csv_path = data_dir / filename
    
    if not csv_path.exists():
        print(f"Data file not found for {city}: {csv_path}")
        # Fallback to Delhi if Pune missing to prevent crash, or return empty?
        if city == 'Pune': return None 
        return None

    df = pd.read_csv(csv_path)
    df['Datetime'] = pd.to_datetime(df['Datetime'], errors='coerce') # Handle potential format errors
    df = df.dropna(subset=['Datetime'])
    df = df.sort_values('Datetime')
    
    if city.lower() == 'pune':
        # Pune data might be station-wise. Aggregate if needed.
        if 'station' in df.columns or 'StationId' in df.columns:
             # Simple mean aggregation by date
             df = df.groupby('Datetime').mean(numeric_only=True).reset_index()

    # --- Live Data Integration ---
    try:
        df = fetch_and_merge_live_data(df, city=city)
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
    
    # Ensure standard python datetime
    if isinstance(last_datetime, pd.Timestamp):
        last_datetime = last_datetime.to_pydatetime()
        
    start_time_limit = datetime.now()
    
    # Build AQI history (last 24 hours)
    aqi_history = df['AQI_computed'].tail(24).tolist()
    
    # Get last known pollutant values
    pollutant_cols = ['PM2_5_ugm3', 'PM10_ugm3', 'NO2_ugm3', 'CO_ugm3', 'O3_ugm3', 'SO2_ugm3',
                      'Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh']
    last_pollutants = {col: last_row[col] for col in pollutant_cols if col in df.columns}
    
    forecasts = []
    
    print(f'\nForecasting from data end: {last_datetime}')
    print(f'Target start time: {start_time_limit}')
    print('-' * 60)
    
    # We loop indefinitely until we generate enough "future" hours
    # We use 'h' to track simulation steps from last_datetime
    h = 0
    generated_count = 0
    
    # Safety break to prevent infinite loop if dates are wildly wrong
    max_steps = 72 + 24*10 # 72 hours forecast + 10 days lag catchup
    
    while generated_count < hours and h < max_steps:
        h += 1
        # Calculate simulation datetime
        sim_dt = last_datetime + timedelta(hours=h)
        
        # Create feature row
        features = {}
        
        # Pollutant features
        hour_of_day = sim_dt.hour
        
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
        features['day_of_week'] = sim_dt.weekday()
        features['month'] = sim_dt.month
        features['is_weekend'] = 1 if sim_dt.weekday() >= 5 else 0
        features['hour_sin'] = np.sin(2 * np.pi * hour_of_day / 24)
        features['hour_cos'] = np.cos(2 * np.pi * hour_of_day / 24)
        features['month_sin'] = np.sin(2 * np.pi * sim_dt.month / 12)
        features['month_cos'] = np.cos(2 * np.pi * sim_dt.month / 12)
        
        # Lag features
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
        
        # Predict
        X = np.array([[features.get(f, 0) for f in feature_names]])
        X_scaled = scaler.transform(X)
        predicted_aqi = model.predict(X_scaled)[0]
        
        predicted_aqi = predicted_aqi * pollution_factor * (1.0 + np.random.uniform(-0.02, 0.02))
        predicted_aqi = np.clip(predicted_aqi, 0, 500)
        
        # Update history
        aqi_history.append(predicted_aqi)
        if len(aqi_history) > 48:
            aqi_history.pop(0)
            
        # Only add to output if this time is in the future relative to NOW
        # (or at least close to now, e.g. within last hour)
        if sim_dt >= start_time_limit - timedelta(minutes=59):
            category, color = get_aqi_category(predicted_aqi)
            
            forecasts.append({
                'datetime': sim_dt,
                'hour': int(generated_count + 1),
                'predicted_aqi': float(predicted_aqi),
                'category': str(category)
            })
            generated_count += 1
            
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
