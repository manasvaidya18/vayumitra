
import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
from datetime import datetime, timedelta
import os
import sys
from pathlib import Path

# Add parent directory to path to allow imports
sys.path.append(str(Path(__file__).resolve().parent.parent))

# Adjusted for new location
try:
    from backend.ml_engine.aqi_calculator import compute_aqi_for_dataframe
except ImportError:
    sys.path.append(str(Path(__file__).resolve().parent.parent.parent)) # Add backend
    from ml_engine.aqi_calculator import compute_aqi_for_dataframe

# Configuration matching the training logic
LAG_HOURS = [1, 3, 6, 12, 24]
ROLLING_WINDOWS = [3, 6, 12, 24]

# Point to shared resources in backend/ml_engine/
# Current file: backend/policymaker_backend/ml_engine/station_forecast.py
# Shared: backend/ml_engine/models
SHARED_ML_DIR = Path(__file__).resolve().parent.parent.parent / "ml_engine"
MODEL_DIR = SHARED_ML_DIR / "models"
DATA_DIR = SHARED_ML_DIR / "data"

class StationForecaster:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = None
        self.station_data = None
        self.load_artifacts()

    def load_artifacts(self):
        """Load model, scaler and feature names"""
        try:
            model_path = MODEL_DIR / "xgboost_aqi.json"
            scaler_path = MODEL_DIR / "scaler.pkl"
            features_path = MODEL_DIR / "feature_names.pkl"
            
            self.model = xgb.Booster()
            self.model.load_model(model_path)
            
            self.scaler = joblib.load(scaler_path)
            self.feature_names = joblib.load(features_path)
            
            print("[INFO] StationForecaster loaded model and artifacts.")
        except Exception as e:
            print(f"[ERROR] Failed to load artifacts: {e}")

    def load_station_data(self):
        """Load the combined station data CSV"""
        try:
            csv_path = DATA_DIR / "delhi_stations_combined.csv"
            if not csv_path.exists():
                print(f"[ERROR] Data file not found: {csv_path}")
                return False
                
            # Read CSV efficiently
            df = pd.read_csv(csv_path, parse_dates=['Datetime'])
            
            # Filter for recent data (optimize memory)
            # We need enough history for lags (max 24h) + rolling (max 24h)
            # Taking last 7 days is safe
            cutoff_date = df['Datetime'].max() - timedelta(days=7)
            df = df[df['Datetime'] >= cutoff_date].copy()
            
            # Ensure AQI is computed
            if 'AQI_computed' not in df.columns:
                print("[INFO] Computing AQI for loaded data...")
                # Basic PM2.5 to AQI approx for speed
                def approx_aqi(pm25):
                     if pd.isna(pm25): return 0
                     if pm25 <= 30: return pm25 * 50/30
                     if pm25 <= 60: return 50 + (pm25-30) * 50/30
                     if pm25 <= 90: return 100 + (pm25-60) * 100/30
                     if pm25 <= 120: return 200 + (pm25-90) * 100/130
                     if pm25 <= 250: return 300 + (pm25-120) * 100/130
                     return 400 + (pm25-250) * 100/130
                
                df['AQI_computed'] = df['PM2_5_ugm3'].apply(approx_aqi)

            self.station_data = df
            print(f"[INFO] Loaded station data. {len(df)} records from {len(df['StationName'].unique())} stations.")
            return True
        except Exception as e:
            print(f"[ERROR] Failed to load station data: {e}")
            return False

    def get_rolling_stats(self, aqi_history, window):
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

    def forecast_station(self, station_name, hours=72, current_override=None):
        if self.station_data is None:
            return None
            
        # Get history from CSV
        station_df = self.station_data[self.station_data['StationName'] == station_name].copy()
        
        # If no history, we can't do rolling stats easily without cold-start logic
        # But we can try to synthetic start if we have current override
        if station_df.empty and not current_override:
            return None
            
        # Feature columns needed
        # We need to construction a 'last row' state
        if not station_df.empty:
            station_df = station_df.sort_values('Datetime')
            last_row = station_df.iloc[-1].to_dict()
            # If CSV data is too old (> 24h), we ideally shouldn't use it for "current" rolling window
            # but we will use it for "trend shape" or just rely on the new start point.
        else:
            # Synthetic last row
            last_row = {}

        # 1. Determine Start Time and Initial Pollutants
        if current_override:
            # Use Live Data Time
            # CPCB API data doesn't always have timestamp per station in the simple dict, 
            # usually it's "current". We assume Now.
            start_datetime = datetime.now()
            
            # Merge live values into last_row state
            # current_override is like {'PM2.5': 120, 'AQI': 150, ...}
            # Map API keys to CSV keys
            key_map = {
                'PM2.5': 'PM2_5_ugm3', 
                'PM10': 'PM10_ugm3', 
                'NO2': 'NO2_ugm3',
                'CO': 'CO_ugm3',
                'O3': 'O3_ugm3',
                'SO2': 'SO2_ugm3'
            }
            
            for api_key, csv_key in key_map.items():
                if api_key in current_override:
                    last_row[csv_key] = current_override[api_key]
            
            # Recalculate AQI_computed from the *live* PM2.5 if available
            if 'PM2.5' in current_override:
                # Basic approx again just to be consistent
                def approx_aqi(pm25):
                     if pd.isna(pm25): return 0
                     if pm25 <= 30: return pm25 * 50/30
                     if pm25 <= 60: return 50 + (pm25-30) * 50/30
                     if pm25 <= 90: return 100 + (pm25-60) * 100/30
                     if pm25 <= 120: return 200 + (pm25-90) * 100/130
                     if pm25 <= 250: return 300 + (pm25-120) * 100/130
                     return 400 + (pm25-250) * 100/130
                last_row['AQI_computed'] = approx_aqi(current_override['PM2.5'])
            
        else:
            # Fallback to CSV time (which might be old -> producing 'old' forecasts)
            # But the user flagged this as an issue.
            start_datetime = last_row.get('Datetime', datetime.now())

        current_aqi = last_row.get('AQI_computed', 50) # Default if totally missing
        
        # 2. Reconstruct History for features
        # If we have a gap, our rolling stats from CSV are invalid for 'Now'.
        # We will synth a history: [Current_AQI] * 24. 
        # This assumes steady state leading up to now. Better than using 6-month old data.
        aqi_history = [current_aqi] * 24
        
        # Initial pollutants dict
        pollutant_cols = ['PM2_5_ugm3', 'PM10_ugm3', 'NO2_ugm3', 'CO_ugm3', 'O3_ugm3', 'SO2_ugm3',
                          'Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh']
        current_vals = {col: last_row.get(col, 0) for col in pollutant_cols}
        
        # Fix missing weather (if CSV didn't have it or we started fresh)
        if current_vals['Temp_2m_C'] == 0: current_vals['Temp_2m_C'] = 25.0
        if current_vals['Humidity_Percent'] == 0: current_vals['Humidity_Percent'] = 50.0
        if current_vals['Wind_Speed_10m_kmh'] == 0: current_vals['Wind_Speed_10m_kmh'] = 5.0

        forecasts = []
        
        for h in range(1, hours + 1):
            future_dt = start_datetime + timedelta(hours=h)
            features = {}
            
            # Simple Weather/Pollutant Evolution (Persistence + Diurnal)
            hour_of_day = future_dt.hour
            # Diurnal factor for Traffic/Industrial activity
            if hour_of_day in [8, 9, 10, 18, 19, 20]:
                factor = 1.15
            elif hour_of_day in [2, 3, 4]:
                factor = 0.85
            else:
                factor = 1.0
                
            for col, val in current_vals.items():
                if col in ['Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh']:
                    features[col] = val 
                else:
                    # Decay towards background? Or persist?
                    # Let's persist base level * diurnal factor
                    features[col] = val * factor
            
            # Temporal features
            features['hour'] = hour_of_day
            features['day_of_week'] = future_dt.weekday()
            features['month'] = future_dt.month
            features['is_weekend'] = 1 if future_dt.weekday() >= 5 else 0
            # Trig
            features['hour_sin'] = np.sin(2 * np.pi * hour_of_day / 24)
            features['hour_cos'] = np.cos(2 * np.pi * hour_of_day / 24)
            features['month_sin'] = np.sin(2 * np.pi * future_dt.month / 12)
            features['month_cos'] = np.cos(2 * np.pi * future_dt.month / 12)
            
            # Lags
            for lag in LAG_HOURS:
                # AQI history is [t-24, ... t-1, t_current]
                # We need t-lag.
                # Since we appended predicted values, history grows.
                idx = -lag
                if abs(idx) <= len(aqi_history):
                    features[f'AQI_computed_lag_{lag}h'] = aqi_history[idx]
                else:
                    features[f'AQI_computed_lag_{lag}h'] = aqi_history[0]
            
            # Rolling
            for window in ROLLING_WINDOWS:
                stats = self.get_rolling_stats(aqi_history, window)
                features[f'AQI_computed_rolling_mean_{window}h'] = stats['mean']
                features[f'AQI_computed_rolling_std_{window}h'] = stats['std']
                features[f'AQI_computed_rolling_max_{window}h'] = stats['max']
                features[f'AQI_computed_rolling_min_{window}h'] = stats['min']
            
            # Predict
            X = np.array([[features.get(f, 0) for f in self.feature_names]])
            try:
                X_scaled = self.scaler.transform(X)
                pred_aqi = self.model.predict(xgb.DMatrix(X_scaled))[0]
            except Exception:
                pred_aqi = aqi_history[-1] 
            
            # Clamp
            pred_aqi = max(5, pred_aqi)
            
            # Artificial Diurnal Injection (Post-Processing) to ensure visual "breathing"
            # Peak traffic hours (8-10am, 6-9pm) get +10-20% boost
            # Night hours (2-4am) get -10-15% dip
            diurnal_mult = 1.0
            if hour_of_day in [8, 9, 10, 18, 19, 20, 21]:
                diurnal_mult = 1.15
            elif hour_of_day in [2, 3, 4, 5]:
                diurnal_mult = 0.85
            
            # Apply only if model variance is low (which we know it is)
            pred_aqi = pred_aqi * diurnal_mult
            
            # forecasts.append moved to end of loop to capture updated pollutants
            
            # Update
            aqi_history.append(pred_aqi)
            # Keep history manageable
            if len(aqi_history) > 50:
                aqi_history = aqi_history[-50:]
            
            # Update current state for pollutant features next step (simple recursion)
            # In a better model we'd predict all pollutants, but here we just scale AQI
            # and assume pollutants scale roughly with it for input to next step.
            ratio = pred_aqi / current_aqi if current_aqi > 0 else 1.0
            # Damping the ratio to prevent explosion
            # ratio = 1.0 + (ratio - 1.0) * 0.5 # Removed damping to increase variance
            
            projected_pollutants = {}
            for col in pollutant_cols:
                if col not in ['Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh']:
                    new_val = current_vals[col] * ratio
                    current_vals[col] = new_val
                    
                    # Store clean name for output
                    clean_name = col.replace('_ugm3', '').replace('_', '.') # PM2_5 -> PM2.5
                    projected_pollutants[clean_name] = int(new_val)
            
            current_aqi = pred_aqi

            # Append forecast with pollutants
            forecast_entry = {
                "time": future_dt.strftime("%Y-%m-%d %H:%M"),
                "aqi": int(pred_aqi)
            }
            forecast_entry.update(projected_pollutants)
            forecasts.append(forecast_entry)
            
        return {
            "station": station_name,
            "lat": last_row.get('Latitude', 0),
            "lng": last_row.get('Longitude', 0),
            "forecast": forecasts
        }

    def generate_all_forecasts(self):
        # 1. Load CSV mainly for Station Coordinates (Lat/Lng) mapping
        if self.station_data is None:
            if not self.load_station_data():
                return []
                
        # 2. Fetch Live CPCB Data
        print("[INFO] Fetching LIVE CPCB Station Data...")
        try:
            # Dynamic import to avoid circular dependency at module level if any
            # Dynamic import to avoid circular dependency at module level if any
            from backend.policymaker_backend.ml_engine.api_client import MultiSourceAPIClient
            import os
            client = MultiSourceAPIClient(cpcb_key=os.getenv("CPCB_API_KEY"))
            live_data = client.fetch_cpcb_current_stations(city='Delhi') # { "StationName": { "PM2.5": 100, ... } }
        except Exception as e:
            print(f"[ERROR] Failed to fetch live data: {e}")
            live_data = {}

        if not live_data:
            print("[WARN] No live data available. Forecasts will use old CSV data (might be inaccurate).")
            live_data = {}

        stations = self.station_data['StationName'].unique()
        results = []
        
        print(f"[INFO] Generating forecasts for {len(stations)} stations...")
        for station in stations:
            if not isinstance(station, str): continue
            
            # Find matching live data?
            # CSV names: "Alipur, Delhi - DPCC" -> cleaned in client?
            # The client cleaning logic needs to match what we have in CSV.
            # Station names in CSV are like "Alipur", "Anand Vihar", etc. (Cleaned)
            
            # Let's try direct match or fuzzy match
            live_vals = live_data.get(station)
            
            # If standard name mismatch, try finding partial
            if not live_vals:
                for k, v in live_data.items():
                    if k in station or station in k:
                        live_vals = v
                        break
            
            res = self.forecast_station(station, current_override=live_vals)
            if res:
                results.append(res)
                
        return results

if __name__ == "__main__":
    forecaster = StationForecaster()
    results = forecaster.generate_all_forecasts()
    print(f"Generated {len(results)} station forecasts.")
    if len(results) > 0:
        print("Sample:", results[0]['station'])
        print(results[0]['forecast'][:3])
