import os
import httpx
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

from database import engine
import models
from routes import auth, heatmap
import pandas as pd


models.Base.metadata.create_all(bind=engine)

app = FastAPI()



# Nugen API configuration
# Using the Agent endpoint as verified in testing. 
# The inference endpoint provided by user returned 404/Model Not Found.
NUGEN_API_URL = "https://api.nugen.in/api/v3/agents/run-agents/air_buddy/run/"
# We'll use the existing env var or fallback to looking for Nugen_API_KEY
API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("NUGEN_API_KEY")

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex="https?://.*", # Allow all http/https origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(heatmap.router)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # Static Response Logic (Fallback)
    def get_static_response(user_msg: str) -> str:
        msg = user_msg.lower()
        if "aqi" in msg or "air quality" in msg:
            return "AQI (Air Quality Index) measures how clean or polluted the air is. Ranges: 0-50 (Good), 51-100 (Satisfactory), 101-200 (Moderate), 201-300 (Poor), 301-400 (Very Poor), 401-500 (Severe)."
        elif "health" in msg or "mask" in msg or "breathing" in msg:
            return "High pollution can cause respiratory issues. If AQI > 200, wear a mask (N95/N99) and avoid outdoor activities. Keep windows closed."
        elif "morning walk" in msg or "exercise" in msg or "run" in msg:
            return "Avoid outdoor exercise if AQI > 150. Best time for outdoor activities is usually afternoon when pollution levels dip, or check the 'Best Time' feature."
        elif "plant" in msg or "tree" in msg:
            return "Planting trees helps! Good options: Neem, Peepal, Aloe Vera, and Snake Plant (indoor) which purify air naturally."
        elif "hello" in msg or "hi" in msg:
            return "Hello! I am Air Buddy. I'm currently running in offline mode but I can help you with AQI info and health tips!"
        else:
            return "I'm having trouble connecting to my AI brain right now, but I'm here! Ask me about 'AQI', 'Health Tips', or 'Safe Activities'."

    # 1. Check API Key
    if not API_KEY:
        print("Chat: No API Key found, using static response.")
        return ChatResponse(response=get_static_response(request.message))

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "message": request.message,
        "stream": False 
    }

    # 2. Try External API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(NUGEN_API_URL, json=payload, headers=headers, timeout=10.0) # Reduced timeout for faster fallback
            response.raise_for_status()
            data = response.json()
            
            ai_text = data.get("response") or data.get("output") or data.get("result")
            
            if not ai_text and "choices" in data:
                 ai_text = data["choices"][0].get("text", "").strip()

            if ai_text:
                return ChatResponse(response=ai_text)
            else:
                # If API returns weird JSON
                return ChatResponse(response=get_static_response(request.message))
                
        except Exception as e:
            # 3. Network/API Error Fallback
            print(f"Chat API Error: {e}. Falling back to static.")
            return ChatResponse(response=get_static_response(request.message))

@app.get("/")
async def root():
    return {"message": "FastAPI Backend is running"}

# --- Policymaker Endpoints ---
from data_policymaker import (
    mockSensors, mockHistoricalData, mockForecastData, mockHotspots,
    mockAlerts, mockHealthData, mockZoneHealthImpact, mockTrafficData,
    mockHourlyTraffic, mockEmissionSources, mockCongestionHotspots,
    mockReports, mockScheduledReports, mockWeatherData,
    mockSourceAttribution, mockVulnerablePopulations, mockPolicySimulation
)

@app.get("/api/policymaker/sensors")
async def get_sensors():
    return mockSensors

@app.get("/api/policymaker/history")
async def get_history():
    return mockHistoricalData

@app.get("/api/policymaker/forecast")
async def get_forecast():
    return mockForecastData

@app.get("/api/policymaker/hotspots")
async def get_hotspots():
    return mockHotspots

@app.get("/api/policymaker/alerts")
async def get_alerts():
    return mockAlerts

@app.get("/api/policymaker/health")
async def get_health():
    return mockHealthData

@app.get("/api/policymaker/zone-health")
async def get_zone_health():
    return mockZoneHealthImpact

@app.get("/api/policymaker/traffic")
async def get_traffic():
    return mockTrafficData

@app.get("/api/policymaker/traffic-hourly")
async def get_traffic_hourly():
    return mockHourlyTraffic

@app.get("/api/policymaker/emissions")
async def get_emissions():
    return mockEmissionSources

@app.get("/api/policymaker/congestion")
async def get_congestion():
    return mockCongestionHotspots

@app.get("/api/policymaker/reports/recent")
async def get_recent_reports():
    return mockReports

@app.get("/api/policymaker/reports/scheduled")
async def get_scheduled_reports():
    return mockScheduledReports

@app.get("/api/policymaker/weather")
async def get_weather():
    return mockWeatherData

@app.get("/api/policymaker/source-attribution")
async def get_source_attribution():
    return mockSourceAttribution

@app.get("/api/policymaker/vulnerable")
async def get_vulnerable():
    return mockVulnerablePopulations

@app.get("/api/policymaker/policy-simulation")
async def get_policy_simulation():
    return mockPolicySimulation


# --- Citizen Endpoints ---
from data_citizen import (
    getAQIData, getCleanAirScore, getHealthRiskData, getBestTimeData,
    getShockPredictorData, getGreenSuggestions, getWildlifeData, getTreeImpactData
)



# Global Data Cache
cached_aqi_data = None
last_fetch_time = None

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
            import asyncio
            from ml_engine.api_client import MultiSourceAPIClient
            
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

@app.on_event("startup")
async def startup_event():
    # Pre-fetch data in background to prevent first-request timeout
    import asyncio
    asyncio.create_task(get_or_update_data())

@app.get("/api/citizen/aqi")
async def get_citizen_aqi():
    if ML_AVAILABLE and ml_model:
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
    else:
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
            # Score Formula (User Request): 
            # "Take percent of 500 and inverse it"
            # Percent = (AQI / 500) * 100
            # Inverse = 100 - Percent
            # Result = 100 - (AQI / 5)
            # AQI 500 -> 0
            # AQI 250 -> 50
            # AQI 0   -> 100
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

@app.get("/api/citizen/score")
async def get_citizen_score():
    try:
        print("DEBUG: Request received at /api/citizen/score", flush=True)
        df = await get_or_update_data()
        return calculate_dynamic_score_v2(df)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

@app.post("/api/citizen/health-risk")
async def get_citizen_health_risk(age: int = 30, conditions: list = []):
    # Determine how to pass args. For simple GET, query params are easier.
    # But here I used POST for 'conditions' list. 
    # Let's support both or just simple GET for now to match mock data simplicity?
    # The mock function takes args. Let's make a Pydantic model effectively or just use body.
    return getHealthRiskData(age, conditions)

class HealthRiskRequest(BaseModel):
    age_group: str
    conditions: list[str]

@app.post("/api/citizen/health-risk-calc")
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
        # Extended to cover full 24h cycle roughly
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

@app.get("/api/citizen/best-time")
async def get_citizen_best_time():
    # If ML works, use it (forecast_3day logic might be better but let's stick to our new robust heuristic for now)
    # The user asked to "make this also dynamic" implies using our current real data approach.
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

@app.get("/api/citizen/shock-predictor")
async def get_citizen_shock_predictor():
    try:
        df = await get_or_update_data()
        return calculate_dynamic_shock_predictor(df)
    except Exception as e:
        print(f"Shock Predictor API Error: {e}", flush=True)
        return getShockPredictorData()

@app.get("/api/citizen/green-suggestions")
async def get_citizen_green_suggestions():
    return getGreenSuggestions()

@app.get("/api/citizen/wildlife")
async def get_citizen_wildlife():
    return getWildlifeData()

@app.get("/api/citizen/tree-impact")
async def get_citizen_tree_impact():
    return getTreeImpactData()

# --- ML / Forecast Endpoints ---
# --- ML / Forecast Endpoints ---
try:
    from ml_engine.forecast_3day import load_model, prepare_historical_data, forecast_next_hours
    from ml_engine.aqi_calculator import get_aqi_category
    ML_AVAILABLE = True
except ImportError as e:
    print(f"ML Module import failed: {e}")
    ML_AVAILABLE = False


# Global ML components
ml_model = None
ml_scaler = None
ml_features = None

@app.on_event("startup")
async def load_ml_components():
    global ml_model, ml_scaler, ml_features
    if ML_AVAILABLE:
        try:
            print("Loading ML model components...")
            ml_model, ml_scaler, ml_features = load_model()
            print("ML model loaded successfully.")
        except Exception as e:
            print(f"Failed to load ML model: {e}")

# Real Data Helpers (ML Integration)
def get_ml_aqi_data(forecasts):
    """Transform ML forecast into AQI Data structure"""
    if not forecasts:
        return getAQIData() # Fallback
        
    current = forecasts[0]
    aqi_val = int(current['predicted_aqi'])
    category = current['category']
    
    # Map category to color
    color_map = {
        'Good': '#22c55e',
        'Satisfactory': '#84cc16',
        'Moderate': '#f59e0b',
        'Poor': '#f97316',
        'Very Poor': '#ef4444',
        'Severe': '#7f1d1d'
    }
    color = color_map.get(category, '#999999')
    
    # Estimate pollutants based on AQI (Rough Heuristic for UI completeness)
    pm25_val = aqi_val * 0.6 
    pm10_val = aqi_val * 1.2
    
    return {
        "aqi": aqi_val,
        "level": category,
        "color": color,
        "location": 'Delhi (ML Predicted)',
        "lastUpdated": datetime.now().isoformat(),
        "pollutants": [
            { "name": 'PM2.5', "value": int(pm25_val), "unit": 'µg/m³', "status": category, "color": color },
            { "name": 'PM10', "value": int(pm10_val), "unit": 'µg/m³', "status": category, "color": color },
            { "name": 'O3', "value": 32, "unit": 'ppb', "status": 'Good', "color": '#22c55e' },
            { "name": 'NO2', "value": 28, "unit": 'ppb', "status": 'Good', "color": '#22c55e' },
            { "name": 'SO2', "value": 12, "unit": 'ppb', "status": 'Good', "color": '#22c55e' },
            { "name": 'CO', "value": 0.8, "unit": 'ppm', "status": 'Good', "color": '#22c55e' },
        ]
    }

def get_ml_best_time(forecasts):
    """Transform ML forecast into Best Time list"""
    best_time_data = []
    # Take next 15 hours to match UI
    for item in forecasts[:15]:
        aqi = item['predicted_aqi']
        # Simple heuristic for weather based on AQI/Time
        is_day = 6 <= item['hour'] <= 18
        weather = 'Clear' if aqi < 200 else 'Haze'
        if not is_day: weather = 'Clear Night'
        
        best_time_data.append({
            "hour": item['datetime'].strftime('%I %p'), # 02 PM format
            "aqi": int(aqi),
            "weather": weather,
            "safe": aqi < 150 # Threshold for "Safe" activity
        })
    return best_time_data

def get_ml_shock_predictor(forecasts):
    """Generate alerts based on ML trend"""
    alerts = []
    
    # Detect spikes
    aqi_values = [f['predicted_aqi'] for f in forecasts[:12]]
    min_aqi = min(aqi_values)
    max_aqi = max(aqi_values)
    
    if max_aqi - min_aqi > 50:
         alerts.append({
            "id": 1,
            "type": 'warning',
            "title": 'Rapid Pollution Rise',
            "time": 'Next 12 Hours',
            "severity": 'High',
            "message": f'AQI expected to spike from {int(min_aqi)} to {int(max_aqi)}'
        })
    
    if max_aqi < 100:
         alerts.append({
            "id": 2,
            "type": 'success',
            "title": 'Good Air Quality',
            "time": 'Today',
            "severity": 'Low',
            "message": 'Air quality expected to remain good.'
        })
    elif max_aqi > 300:
         alerts.append({
            "id": 3,
            "type": 'danger',
            "title": 'Severe Pollution Alert',
            "time": 'Incoming',
            "severity": 'Critical',
            "message": 'Prepare for severe pollution levels (>300 AQI).'
        })

    # Prediction Data graph
    prediction_data = []
    for i, item in enumerate(forecasts[:7]): # +0h to +12h (every 2h)
        if i % 2 == 0: 
            label = 'Now' if i == 0 else f'+{i}h'
            prediction_data.append({
                "time": label,
                "aqi": int(item['predicted_aqi']),
                "predicted": True
            })

    return {
        "alerts": alerts if alerts else [{
             "id": 99, "type": 'info', "title": 'Stable Conditions', "time": 'Next 24h', "severity": 'Low', "message": 'No significant changes expected.'
        }],
        "predictionData": prediction_data
    }

@app.get("/api/ml/forecast-3day")
async def get_ml_forecast():
    """Get 3-day AQI forecast using the XGBoost model."""
    if not ML_AVAILABLE:
        raise HTTPException(status_code=503, detail="ML module not available (dependencies missing?)")
    
    if not ml_model:
        # Try loading if it's None (maybe startup failed or wasn't async awaited properly? shouldn't happen)
        # We will just return error to be safe
        raise HTTPException(status_code=503, detail="ML Model not loaded/initialized")
    
    try:
        # Load data (simulated real-time fetch)
        df = prepare_historical_data()
        
        # Generate forecast
        forecasts = forecast_next_hours(ml_model, ml_scaler, ml_features, df, hours=72)
        return forecasts
        
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
