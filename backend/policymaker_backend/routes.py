from fastapi import APIRouter
from policymaker_backend.services import (
    mockSensors, mockHistoricalData, mockForecastData, mockHotspots,
    mockAlerts, mockHealthData, mockZoneHealthImpact, mockTrafficData,
    mockHourlyTraffic, mockEmissionSources, mockCongestionHotspots,
    mockReports, mockScheduledReports, mockWeatherData,
    mockSourceAttribution, mockVulnerablePopulations, mockPolicySimulation
)
import os

router = APIRouter()

@router.get("/sensors")
async def get_sensors():
    return mockSensors

@router.get("/history")
async def get_history():
    return mockHistoricalData

@router.get("/forecast")
async def get_forecast():
    return mockForecastData

@router.get("/hotspots")
async def get_hotspots():
    return mockHotspots

@router.get("/alerts")
async def get_alerts():
    return mockAlerts

@router.get("/health")
async def get_health():
    return mockHealthData

@router.get("/zone-health")
async def get_zone_health():
    return mockZoneHealthImpact

@router.get("/traffic")
async def get_traffic():
    return mockTrafficData

@router.get("/traffic-hourly")
async def get_traffic_hourly():
    return mockHourlyTraffic

@router.get("/emissions")
async def get_emissions():
    return mockEmissionSources

@router.get("/congestion")
async def get_congestion():
    return mockCongestionHotspots

@router.get("/reports/recent")
async def get_recent_reports():
    return mockReports

@router.get("/reports/scheduled")
async def get_scheduled_reports():
    return mockScheduledReports

@router.get("/weather")
async def get_weather():
    return mockWeatherData

@router.get("/source-attribution")
async def get_source_attribution():
    try:
        # Update path to point to frontend public data from new location
        # Original: ..\vayumitra-final\public\data
        # New location is backend/policymaker_backend
        # logic: backend/policymaker_backend/routes.py -> ../../vayumitra-final/public/data
        path = os.path.join(os.path.dirname(__file__), '..', '..', 'vayumitra-final', 'public', 'data', 'source_attribution.json')
        if os.path.exists(path):
            import json
            with open(path, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error reading source attribution file: {e}")
    
    # Fallback to mock
    return mockSourceAttribution

@router.get("/vulnerable")
async def get_vulnerable():
    return mockVulnerablePopulations

@router.get("/policy-simulation")
async def get_policy_simulation():
    return mockPolicySimulation
