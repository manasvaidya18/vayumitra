import os
import httpx
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
from .data_policymaker import (
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
from .data_citizen import (
    getAQIData, getCleanAirScore, getHealthRiskData, getBestTimeData,
    getShockPredictorData, getGreenSuggestions, getWildlifeData, getTreeImpactData
)

@app.get("/api/citizen/aqi")
async def get_citizen_aqi():
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
    return getBestTimeData()

@app.get("/api/citizen/shock-predictor")
async def get_citizen_shock_predictor():
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
