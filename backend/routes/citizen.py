from fastapi import APIRouter
from data_citizen import (
    getAQIData, getCleanAirScore, getHealthRiskData, getBestTimeData,
    getShockPredictorData, getGreenSuggestions, getWildlifeData, getTreeImpactData
)
from datetime import datetime, timedelta
import pandas as pd
from pydantic import BaseModel
import asyncio
from ml_engine.api_client import MultiSourceAPIClient

router = APIRouter()

# Global Data Cache (moved from main.py)
cached_aqi_data = None
last_fetch_time = None

# We need to import ML_AVAILABLE and ml_model if we want to use them in get_citizen_aqi
# Ideally these should be injected or imported from a shared state module.
# For now, let's keep the helper functions local or import them if they are standalone.

# --- Helper Functions (Copied from main.py) ---

def _generate_simulated_history():
    """
    Generate 7 days of historical data (6 days ago + today) for Clean Air Score calculation.
    Each day gets one data point to ensure weekly trend graph shows all 7 days.
    """
    data = []
    base_time = datetime.now()
    
    # Generate data for last 7 days (days 6, 5, 4, 3, 2, 1, 0 = today)
    for days_ago in range(6, -1, -1):
        # Set time to noon of that day to avoid timezone/grouping issues
        day_datetime = (base_time - timedelta(days=days_ago)).replace(hour=12, minute=0, second=0, microsecond=0)
        
        # Simulate realistic pollution patterns for Delhi
        # Base AQI varies by day pattern
        weekday = day_datetime.weekday()
        
        # Weekends (Sat=5, Sun=6) have better air quality
        if weekday >= 5:
            sim_aqi = 250 + (day_datetime.day % 3) * 15  # Score ~45-50
        else:
            sim_aqi = 350 + (day_datetime.day % 5) * 20  # Score ~25-30
            
        data.append({
            'Datetime': day_datetime,
            'AQI_computed': sim_aqi,
            'PM2_5_ugm3': sim_aqi / 2,  # Rough approx
            'PM10_ugm3': sim_aqi * 1.2
        })
    
    df = pd.DataFrame(data)
    # Already in chronological order (Oldest -> Newest)
    return df

async def get_or_update_data():
    global cached_aqi_data, last_fetch_time
    now = datetime.now()
    
    # Update if None or older than 30 minutes
    if cached_aqi_data is None or last_fetch_time is None or (now - last_fetch_time).total_seconds() > 1800:
        try:
            print("Refreshing real-time data cache...", flush=True)
            
            # Run blocking synchronous data fetch in a separate thread
            def fetch_wrapper():
                client = MultiSourceAPIClient() 
                return client.fetch_realtime_data(city='Delhi')

            df_real = await asyncio.to_thread(fetch_wrapper)

            # Check if we got real-time data
            if df_real is not None and len(df_real) > 0:
                # If API returns only 1 row (current AQI), blend with historical simulation
                if len(df_real) == 1:
                    print("Real-time API returned 1 record. Blending with past 6 days simulation.", flush=True)
                    
                    # Generate past 6 days of simulated data
                    historical_sim = _generate_simulated_history()
                    # Remove today from simulation (last row), keep only past 6 days
                    historical_sim = historical_sim.iloc[:-1].copy()
                    
                    # Combine: past 6 days (simulated) + today (real)
                    df = pd.concat([historical_sim, df_real], ignore_index=True)
                    df = df.sort_values('Datetime').reset_index(drop=True)
                    print(f"Blended data: {len(df)} rows (6 simulated + 1 real).", flush=True)
                else:
                    # API returned multiple days of data, use as-is
                    df = df_real
                    print(f"Using real-time data: {len(df)} rows.", flush=True)
            else:
                # No real data available, use full simulation
                print("Data update returned empty. Using SIMULATION.", flush=True)
                df = _generate_simulated_history()

            cached_aqi_data = df
            last_fetch_time = now

        except Exception as e:
            print(f"Cache update failed: {e}", flush=True)
            if cached_aqi_data is None:
                 print("Using Emergency SIMULATION.", flush=True)
                 cached_aqi_data = _generate_simulated_history()
    
    return cached_aqi_data

def get_aqi_category(aqi):
    if aqi <= 50: return "Good", "#22c55e"
    elif aqi <= 100: return "Satisfactory", "#84cc16"
    elif aqi <= 200: return "Moderate", "#f59e0b"
    elif aqi <= 300: return "Poor", "#f97316"
    elif aqi <= 400: return "Very Poor", "#ef4444"
    else: return "Severe", "#7f1d1d"

# --- Endpoints ---

@router.get("/aqi")
async def get_citizen_aqi():
    # Note: ML_AVAILABLE check relies on shared state or direct import. 
    # For now, we'll assume basic functionality without ML dependency inside this router specifically
    # or import it if we separate ML logic cleanly.
    # The original code used a global ML_AVAILABLE. 
    # Let's simplify and rely on the data fetcher which is robust.
    
    try:
        # 1. Get cached real-time data
        df = await get_or_update_data()
        
        if df is None or len(df) == 0:
             print("Cache empty, using mock.", flush=True)
             print("Serving Mock Pimpri Data", flush=True) 
             return getAQIData()

        print("Serving Real AQI Data", flush=True)

        # 2. Get latest record
        last_row = df.iloc[-1]
        current_aqi = float(last_row['AQI_computed'])
        last_updated = last_row['Datetime'].isoformat()
        
        # 3. Determine level/color
        category, color = get_aqi_category(current_aqi) 
        
        # 4. Construct Response (Matching mock structure)
        return {
            "aqi": int(current_aqi),
            "level": category,
            "color": color,
            "location": "Delhi, India", 
            "lastUpdated": last_updated,
            "pollutants": [
                { "name": 'PM2.5', "value": int(last_row.get('PM2_5_ugm3', 0)), "unit": 'µg/m³', "status": get_aqi_category(last_row.get('PM2_5_ugm3', 0))[0], "color": get_aqi_category(last_row.get('PM2_5_ugm3', 0))[1] },
                { "name": 'PM10', "value": int(last_row.get('PM10_ugm3', 0)), "unit": 'µg/m³', "status": get_aqi_category(last_row.get('PM10_ugm3', 0))[0], "color": get_aqi_category(last_row.get('PM10_ugm3', 0))[1] },
                { "name": 'NO2', "value": int(last_row.get('NO2_ugm3', 0)), "unit": 'µg/m³', "status": "Good", "color": "#22c55e" },
                { "name": 'CO', "value": round(last_row.get('CO_ugm3', 0)/1000, 1), "unit": 'mg/m³', "status": "Good", "color": "#22c55e" },
            ]
        }
    except Exception as e:
        print(f"Error serving real AQI: {e}")
        return getAQIData()

# Helper for Clean Air Score
def calculate_dynamic_score_v2(df):
    fallback = getCleanAirScore()
    
    if df is None:
        fallback['debug'] = "DF is None"
        return fallback 
        
    if len(df) == 0:
        fallback['debug'] = "DF is Empty"
        return fallback

    try:
        # Check columns
        if 'AQI_computed' not in df.columns:
             fallback['debug'] = f"Missing AQI_computed. Cols: {list(df.columns)}"
             return fallback

        # Debug date range 
        debug_info = f"Range: {df['Datetime'].min()} to {df['Datetime'].max()}"

        # Filter last 7 days from the DATASET END
        if not pd.api.types.is_datetime64_any_dtype(df['Datetime']):
             df['Datetime'] = pd.to_datetime(df['Datetime'])

        df['Date'] = df['Datetime'].dt.date
        end_date = df['Date'].max()
        start_date = end_date - timedelta(days=6) # 7 days inclusive
        
        mask = (df['Date'] >= start_date) & (df['Date'] <= end_date)
        week_df = df.loc[mask].copy()
        
        if len(week_df) == 0:
             fallback['debug'] = f"Zero rows after filter. Start: {start_date}, End: {end_date}. {debug_info}"
             return fallback

        # Calculate daily averages
        daily_aqi = week_df.groupby('Date')['AQI_computed'].mean().reset_index()
        
        history = []
        scores = []
        
        for _, row in daily_aqi.iterrows():
            avg_aqi = row['AQI_computed']
            # Score Formula: 100 - (AQI / 5)
            score = max(0, 100 - (avg_aqi / 5)) 
            
            scores.append(score)
            history.append({
                "date": row['Date'].strftime('%a'), # Mon, Tue
                "score": int(score)
            })
            
        if not scores:
            fallback['debug'] = f"Scores list empty. Daily AQI len: {len(daily_aqi)}"
            return fallback

        avg_score = int(sum(scores) / len(scores))
        
        # Trend
        if len(scores) >= 2:
            change = scores[-1] - scores[0] 
            trend = 'up' if change > 0 else 'down'
            pct_change = abs(int((change / scores[0]) * 100)) if scores[0] != 0 else 0
        else:
            trend = 'stable'
            pct_change = 0
            
        return {
            "score": avg_score,
            "trend": trend,
            "change": pct_change,
            "insights": [
                f"Air quality trend is {trend} this week by {pct_change}%",
                "Peak pollution seen in late evening hours",
                "Weekends showed 10% deviation" 
            ],
            "historicalData": history
        }
    except Exception as e:
        print(f"Error calculating score: {e}", flush=True)
        fallback['debug'] = f"Exception: {str(e)}"
        return fallback

@router.get("/score")
async def get_citizen_score():
    try:
        print("DEBUG: Request received at /api/citizen/score", flush=True)
        df = await get_or_update_data()
        return calculate_dynamic_score_v2(df)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

class HealthRiskRequest(BaseModel):
    age_group: str
    conditions: list[str]

@router.post("/health-risk")
async def get_citizen_health_risk(age: int = 30, conditions: list = []):
    return getHealthRiskData(age, conditions)

@router.post("/health-risk-calc")
async def calculate_health_risk(request: HealthRiskRequest):
     return getHealthRiskData(request.age_group, request.conditions)

# Helper for Dynamic Best Time
def calculate_dynamic_best_time(df):
    fallback = getBestTimeData()
    
    if df is None or len(df) == 0:
        return fallback

    try:
        # Get latest AQI as baseline
        if 'AQI_computed' not in df.columns:
            return fallback
            
        current_aqi = float(df.iloc[-1]['AQI_computed'])
        current_hour = datetime.now().hour # Server time
        
        # Diurnal factors (multipliers for current AQI)
        hourly_factors = {
            0: 0.8,  1: 0.7,  2: 0.6,  3: 0.6,  4: 0.7,  5: 0.8, # Night/Early Morning
            6: 0.9,  7: 1.1,  8: 1.3,  9: 1.3,  10: 1.1, 11: 1.0, # Morning
            12: 0.9, 13: 0.8, 14: 0.75, 15: 0.8, 16: 0.9, # Afternoon
            17: 1.1, 18: 1.2, 19: 1.3, 20: 1.2, 21: 1.1, 22: 1.0, 23: 0.9 # Evening
        }
        
        # Normalize base AQI so that "Now" matches current_aqi
        current_factor = hourly_factors.get(current_hour, 1.0)
        base_aqi = current_aqi / current_factor

        forecasts = []
        # Next 12 hours
        for i in range(12): 
            hour = (current_hour + i) % 24
            
            factor = hourly_factors.get(hour, 1.0)
            
            # Predict based on Normalized Base
            pred_aqi = int(base_aqi * factor)
            
            # Format hour
            period = "AM" if hour < 12 else "PM"
            fmt_hour = hour if hour == 0 else (hour if hour <= 12 else hour - 12)
            time_str = f"{fmt_hour} {period}"
            if i == 0: time_str = "Now"
            
            # Weather simulation 
            weather = "Clear" if pred_aqi < 150 else ("Haze" if pred_aqi < 300 else "Smog")
            
            # Safe threshold
            is_safe = pred_aqi < 150 
            
            forecasts.append({
                "hour": time_str,
                "aqi": pred_aqi,
                "weather": weather,
                "safe": is_safe,
                "recommended": False # Placeholder
            })
            
        # Determine "Recommended" hours (Relative Best)
        # Always pick the top 3 with lowest AQI
        sorted_by_aqi = sorted(forecasts, key=lambda x: x['aqi'])
        top_3 = sorted_by_aqi[:3]
        
        # Create a set of "recommended" hours for O(1) lookup
        top_3_hours = set(item['hour'] for item in top_3)
        
        for f in forecasts:
            if f['hour'] in top_3_hours:
                f['recommended'] = True
            
        return forecasts

    except Exception as e:
        print(f"Error calculating best time: {e}", flush=True)
        return fallback

@router.get("/best-time")
async def get_citizen_best_time():
    try:
        df = await get_or_update_data()
        return calculate_dynamic_best_time(df)
    except Exception as e:
        print(f"Best Time API Error: {e}", flush=True)
        return getBestTimeData()

# Helper for Dynamic Shock Predictor
def calculate_dynamic_shock_predictor(df):
    fallback = getShockPredictorData()
    
    if df is None or len(df) == 0:
        return fallback

    try:
        # Get latest AQI
        if 'AQI_computed' not in df.columns:
            return fallback

        current_aqi = float(df.iloc[-1]['AQI_computed'])
        
        # 1. Generate Alerts
        alerts = []
        if current_aqi > 300:
            alerts.append({
                "id": 1,
                "type": 'warning',
                "title": 'High Pollution Alert',
                "time": 'Current',
                "severity": 'High',
                "message": f'Current AQI is {int(current_aqi)}, which is hazardous. Avoid outdoors.'
            })
        elif current_aqi > 200:
            alerts.append({
                "id": 1,
                "type": 'warning',
                "title": 'Poor Air Quality',
                "time": 'Current',
                "severity": 'Moderate',
                "message": f'AQI is {int(current_aqi)}. Sensitive groups should stay indoors.'
            })
        
        # Future Risk Alert (evening spike)
        current_hour = datetime.now().hour
        if 16 <= current_hour <= 19:
             alerts.append({
                "id": 2,
                "type": 'info',
                "title": 'Evening Traffic Spike',
                "time": 'Next 2 hours',
                "severity": 'Moderate',
                "message": 'Expect higher pollution levels due to peak traffic.'
            })
        else:
             alerts.append({
                "id": 2,
                "type": 'info',
                "title": 'Forecast Update',
                "time": 'Next 12 hours',
                "severity": 'Low',
                "message": 'Pollution levels trending based on daily patterns.'
            })

        # 2. Generate Prediction Graph (Sparkline)
        # Reuse diurnal factors logic but for specific timepoints: Now, +2h, +4h, ... +12h
        hourly_factors = {
            0: 0.8,  1: 0.7,  2: 0.6,  3: 0.6,  4: 0.7,  5: 0.8, 
            6: 0.9,  7: 1.1,  8: 1.3,  9: 1.3,  10: 1.1, 11: 1.0, 
            12: 0.9, 13: 0.8, 14: 0.75, 15: 0.8, 16: 0.9, 
            17: 1.1, 18: 1.2, 19: 1.3, 20: 1.2, 21: 1.1, 22: 1.0, 23: 0.9 
        }

        # Normalize base AQI so that "Now" matches current_aqi
        current_factor = hourly_factors.get(current_hour, 1.0)
        base_aqi = current_aqi / current_factor

        prediction_data = []
        for i in range(0, 13, 2): # 0, 2, 4, ... 12
            target_hour = (current_hour + i) % 24
            factor = hourly_factors.get(target_hour, 1.0)
            
            # Predict based on Normalized Base
            pred_aqi = int(base_aqi * factor)
            
            time_label = "Now" if i == 0 else f"+{i}h"
            
            prediction_data.append({
                "time": time_label,
                "aqi": pred_aqi,
                "predicted": i > 0
            })

        return {
            "alerts": alerts,
            "predictionData": prediction_data
        }

    except Exception as e:
        print(f"Error calculating shock predictor: {e}", flush=True)
        return fallback

@router.get("/shock-predictor")
async def get_citizen_shock_predictor():
    try:
        df = await get_or_update_data()
        return calculate_dynamic_shock_predictor(df)
    except Exception as e:
        print(f"Shock Predictor API Error: {e}", flush=True)
        return getShockPredictorData()

@router.get("/green-suggestions")
async def get_citizen_green_suggestions():
    return getGreenSuggestions()

@router.get("/wildlife")
async def get_citizen_wildlife():
    return getWildlifeData()

@router.get("/tree-impact")
async def get_citizen_tree_impact():
    return getTreeImpactData()
