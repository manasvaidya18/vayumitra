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
from wildlife_config import SPECIES_CONFIG

router = APIRouter()

# Global Data Cache (moved from main.py)
# Global Data Cache (moved from main.py)
cached_aqi_data = {} # Key: City Name, Value: DataFrame
last_fetch_time = {} # Key: City Name, Value: datetime

def get_aqi_category(aqi):
    if aqi <= 50: return "Good", "#22c55e"
    elif aqi <= 100: return "Satisfactory", "#84cc16"
    elif aqi <= 200: return "Moderate", "#f59e0b"
    elif aqi <= 300: return "Poor", "#f97316"
    elif aqi <= 400: return "Very Poor", "#ef4444"
    else: return "Severe", "#7f1d1d"

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
    return df

async def get_or_update_data(city='Delhi'):
    global cached_aqi_data, last_fetch_time
    now = datetime.now()
    
    # Normalize city
    target_city = 'Pune' if city.lower() == 'pune' else 'Delhi'
    
    # Update if None or older than 30 minutes
    if target_city not in cached_aqi_data or target_city not in last_fetch_time or (now - last_fetch_time[target_city]).total_seconds() > 1800:
        try:
            print(f"Refreshing real-time data cache for {target_city}...", flush=True)
            
            # Run blocking synchronous data fetch in a separate thread
            def fetch_wrapper():
                client = MultiSourceAPIClient() 
                return client.fetch_realtime_data(city=target_city)

            df_real = await asyncio.to_thread(fetch_wrapper)

            # Check if we got real-time data
            if df_real is not None and len(df_real) > 0:
                if len(df_real) == 1:
                    print(f"Real-time API returned 1 record for {target_city}. Blending...", flush=True)
                    historical_sim = _generate_simulated_history()
                    historical_sim = historical_sim.iloc[:-1].copy()
                    df = pd.concat([historical_sim, df_real], ignore_index=True)
                    df = df.sort_values('Datetime').reset_index(drop=True)
                else:
                    df = df_real
            else:
                print(f"No real data for {target_city}. Using SIMULATION.", flush=True)
                df = _generate_simulated_history()

            cached_aqi_data[target_city] = df
            last_fetch_time[target_city] = now

        except Exception as e:
            print(f"Cache update failed for {target_city}: {e}", flush=True)
            if target_city not in cached_aqi_data:
                 print("Using Emergency SIMULATION.", flush=True)
                 cached_aqi_data[target_city] = _generate_simulated_history()
    
    return cached_aqi_data.get(target_city)

# --- Endpoints ---

@router.get("/aqi")
async def get_citizen_aqi(city: str = 'Delhi'):
    try:
        # 1. Get cached real-time data
        df = await get_or_update_data(city)
        
        if df is None or len(df) == 0:
             return getAQIData() # Fallback mock

        # 2. Get latest record
        last_row = df.iloc[-1]
        current_aqi = float(last_row['AQI_computed'])
        last_updated = last_row['Datetime'].isoformat()
        
        # 3. Determine level/color
        category, color = get_aqi_category(current_aqi) 
        
        # 4. Construct Response
        return {
            "aqi": int(current_aqi),
            "level": category,
            "color": color,
            "location": f"{city}, India", 
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
async def get_citizen_score(city: str = 'Delhi'):
    try:
        df = await get_or_update_data(city)
        return calculate_dynamic_score_v2(df)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

# ... health risk endpoints (no city dependency for calculation logic yet, maybe demographics differ?)
# Skipping health risk for now

@router.get("/best-time")
async def get_citizen_best_time(city: str = 'Delhi'):
    try:
        df = await get_or_update_data(city)
        return calculate_dynamic_best_time(df)
    except Exception as e:
        print(f"Best Time API Error: {e}", flush=True)
        return getBestTimeData()

@router.get("/shock-predictor")
async def get_citizen_shock_predictor(city: str = 'Delhi'):
    try:
        df = await get_or_update_data(city)
        return calculate_dynamic_shock_predictor(df)
    except Exception as e:
        print(f"Shock Predictor API Error: {e}", flush=True)
        return getShockPredictorData()
# ... green suggestions (generic)

@router.get("/wildlife")
async def get_citizen_wildlife(city: str = 'Delhi'):
    try:
        df = await get_or_update_data(city)
        return calculate_dynamic_wildlife(df)
    except Exception as e:
        print(f"Wildlife API Error: {e}")
        return getWildlifeData()

@router.get("/tree-impact")
async def get_citizen_tree_impact():
    return getTreeImpactData()
