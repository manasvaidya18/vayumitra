import os
import httpx
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from pathlib import Path

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# Nugen API configuration
# Using the Agent endpoint as verified in testing. 
# The inference endpoint provided by user returned 404/Model Not Found.
NUGEN_API_URL = "https://api.nugen.in/api/v3/agents/run-agents/air_buddy/run/"
# We'll use the existing env var or fallback to looking for Nugen_API_KEY
API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("NUGEN_API_KEY")

# CORS configuration
origins = [
    "http://localhost:3000",  # React default port
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API Key not configured")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # payload for Agent API usually expects 'input', 'query', 'text' or 'message'
    # Nugen API returned 422 "Field required: message", so we use 'message'
    payload = {
        "message": request.message,
        "stream": False 
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(NUGEN_API_URL, json=payload, headers=headers, timeout=60.0)
            response.raise_for_status()
            data = response.json()
            
            # Agent API response parsing
            ai_text = data.get("response") or data.get("output") or data.get("result")
            
            if not ai_text and "choices" in data:
                 ai_text = data["choices"][0].get("text", "").strip()

            if ai_text:
                return ChatResponse(response=ai_text)
            else:
                # Fallback: dump the whole JSON if we can't find the text field, for debugging
                return ChatResponse(response=str(data))
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e.response.text))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

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

async def get_or_update_data():
    global cached_aqi_data, last_fetch_time
    now = datetime.now()
    
    # Update if None or older than 30 minutes
    if cached_aqi_data is None or last_fetch_time is None or (now - last_fetch_time).total_seconds() > 1800:
        try:
            print("Refreshing real-time data cache...")
            import asyncio
            # Run blocking synchronous data fetch in a separate thread
            df = await asyncio.to_thread(prepare_historical_data)

            if df is not None and len(df) > 0:
                cached_aqi_data = df
                last_fetch_time = now
                print(f"Data cache updated. {len(df)} rows.")
            else:
                print("Data update failed or returned empty.")
        except Exception as e:
            print(f"Cache update failed: {e}")
    
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
                 print("Cache empty, using mock.")
                 return getAQIData()

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


@app.get("/api/citizen/score")
async def get_citizen_score():
    return getCleanAirScore()

@app.post("/api/citizen/health-risk")
async def get_citizen_health_risk(age: int = 30, conditions: list = []):
    # Determine how to pass args. For simple GET, query params are easier.
    # But here I used POST for 'conditions' list. 
    # Let's support both or just simple GET for now to match mock data simplicity?
    # The mock function takes args. Let's make a Pydantic model effectively or just use body.
    return getHealthRiskData(age, conditions)

class HealthRiskRequest(BaseModel):
    age: int
    conditions: list[str]

@app.post("/api/citizen/health-risk-calc")
async def calculate_health_risk(request: HealthRiskRequest):
     return getHealthRiskData(request.age, request.conditions)

@app.get("/api/citizen/best-time")
async def get_citizen_best_time():
    if ML_AVAILABLE and ml_model:
        try:
             df = prepare_historical_data()
             forecasts = forecast_next_hours(ml_model, ml_scaler, ml_features, df, hours=24)
             return get_ml_best_time(forecasts)
        except Exception as e:
            print(f"ML Fallback Error: {e}")
    return getBestTimeData()

@app.get("/api/citizen/shock-predictor")
async def get_citizen_shock_predictor():
    if ML_AVAILABLE and ml_model:
        try:
             df = prepare_historical_data()
             forecasts = forecast_next_hours(ml_model, ml_scaler, ml_features, df, hours=24)
             return get_ml_shock_predictor(forecasts)
        except Exception as e:
            print(f"ML Fallback Error: {e}")
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
