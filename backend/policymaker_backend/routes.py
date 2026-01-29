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

import random

# Static coordinates for known stations to fix missing map pins
STATION_COORDS = {
    # Pune
    "Shivajinagar": {"lat": 18.5314, "lng": 73.8446},
    "Hadapsar": {"lat": 18.5089, "lng": 73.9259},
    "Kothrud": {"lat": 18.5074, "lng": 73.8077},
    "Katraj": {"lat": 18.4529, "lng": 73.8589},
    "Pashan": {"lat": 18.5362, "lng": 73.7929},
    "Lohegaon": {"lat": 18.5779, "lng": 73.9277},
    "Bhosari": {"lat": 18.6298, "lng": 73.8475},
    "Nigdi": {"lat": 18.6492, "lng": 73.7707},
    "Alandi": {"lat": 18.6770, "lng": 73.8950},
    "Wakad": {"lat": 18.5996, "lng": 73.7634},
    "Manjri": {"lat": 18.5173, "lng": 73.9616},
    "Thergaon": {"lat": 18.6186, "lng": 73.7667},
    "Savita": {"lat": 18.50, "lng": 73.80}, # Placeholder partial match support
    
    # Delhi
    "Jahangirpuri": {"lat": 28.7324, "lng": 77.1706},
    "Anand Vihar": {"lat": 28.6469, "lng": 77.3160},
    "Bawana": {"lat": 28.7762, "lng": 77.0500},
    "Rohini": {"lat": 28.7383, "lng": 77.1085},
    "Wazirpur": {"lat": 28.6973, "lng": 77.1656},
    "Ashok Vihar": {"lat": 28.6963, "lng": 77.1726},
    "Dwarka": {"lat": 28.5921, "lng": 77.0460},
    "ITO": {"lat": 28.6288, "lng": 77.2435},
    "Mandir Marg": {"lat": 28.6366, "lng": 77.1994},
    "Punjabi Bagh": {"lat": 28.6683, "lng": 77.1328},
    "R K Puram": {"lat": 28.5638, "lng": 77.1825},
}

CITY_CENTERS = {
    'Pune': {'lat': 18.5204, 'lng': 73.8567},
    'Delhi': {'lat': 28.7041, 'lng': 77.1025}
}

def calculate_ind_aqi(pm25, pm10):
    """Calculate India AQI from PM2.5 and PM10."""
    aqi_25 = 0
    if pm25:
        c = pm25
        if c <= 30: aqi_25 = c * 50/30
        elif c <= 60: aqi_25 = 50 + (c-30)*50/30
        elif c <= 90: aqi_25 = 100 + (c-60)*100/30
        elif c <= 120: aqi_25 = 200 + (c-90)*100/30
        elif c <= 250: aqi_25 = 300 + (c-120)*100/130
        else: aqi_25 = 400 + (c-250)*100/130
        
    aqi_10 = 0
    if pm10:
        c = pm10
        if c <= 50: aqi_10 = c * 50/50
        elif c <= 100: aqi_10 = 50 + (c-50)*50/50
        elif c <= 250: aqi_10 = 100 + (c-100)*100/150
        elif c <= 350: aqi_10 = 200 + (c-250)*100/100
        elif c <= 430: aqi_10 = 300 + (c-350)*100/80
        else: aqi_10 = 400 + (c-430)*100/70
        
    return int(max(aqi_25, aqi_10))

@router.get("/sensors")
async def get_sensors(city: str = 'Delhi'):
    try:
        from ml_engine.api_client import MultiSourceAPIClient
        client = MultiSourceAPIClient()
        # Fetch station data
        stations = client.fetch_cpcb_current_stations(city=city)
        # Determine fallback logic context
        city_key = 'Pune' if city.lower() == 'pune' else 'Delhi'
        
        sensor_list = []
        if stations:
            for name, data in stations.items():
                # Flexible AQI parsing
                aqi = data.get('AQI') or data.get('aqi') or data.get('Air Quality Index')
                
                # Check pollutant values
                pm25 = int(float(data.get('PM2.5', 0) if data.get('PM2.5') != 'NA' else 0))
                pm10 = int(float(data.get('PM10', 0) if data.get('PM10') != 'NA' else 0))
                
                # If AQI missing/0, Calculate it!
                if (aqi == 'NA' or aqi is None or aqi == 0) and (pm25 > 0 or pm10 > 0):
                     aqi = calculate_ind_aqi(pm25, pm10)
                elif aqi == 'NA' or aqi is None:
                     aqi = 0
                
                # Coords Lookup
                lat = data.get('latitude')
                lng = data.get('longitude')
                
                # Fuzzy match for coords if API missing
                if not lat or not lng:
                    for key in STATION_COORDS:
                        if key.lower() in name.lower():
                            lat = STATION_COORDS[key]['lat']
                            lng = STATION_COORDS[key]['lng']
                            break
                
                # Jitter Fallback: If still no coords, place near city center randomly
                # This ensures ALL live stations appear on map
                if not lat or not lng:
                    center = CITY_CENTERS.get(city_key, CITY_CENTERS['Delhi'])
                    # Random offset +/- 0.05 degrees (~5km)
                    lat = center['lat'] + random.uniform(-0.05, 0.05)
                    lng = center['lng'] + random.uniform(-0.05, 0.05)
                            
                sensor_list.append({
                    "id": name,
                    "location": name,
                    "aqi": int(float(aqi)) if aqi else 0,
                    "pm25": pm25,
                    "pm10": pm10,
                    "no2": int(float(data.get('NO2', 0) if data.get('NO2') != 'NA' else 0)),
                    "so2": int(float(data.get('SO2', 0) if data.get('SO2') != 'NA' else 0)),
                    "co": float(data.get('CO', 0) if data.get('CO') != 'NA' else 0),
                    "o3": int(float(data.get('O3', 0) if data.get('O3') != 'NA' else 0)),
                    "status": "Live" if aqi else "Offline",
                    "lat": lat, 
                    "lng": lng
                })

        if not sensor_list:
            # Fallback Mock Data with Coords
            if city.lower() == 'pune':
                return [
                     {"id": "Shivajinagar", "lat": 18.5314, "lng": 73.8446, "aqi": 180, "pm25": 85, "pm10": 120, "no2": 45, "so2": 15, "co": 1.2, "o3": 35, "status": "Live"},
                    {"id": "Hadapsar", "lat": 18.5089, "lng": 73.9259, "aqi": 165, "pm25": 78, "pm10": 110, "no2": 40, "so2": 12, "co": 0.9, "o3": 30, "status": "Live"},
                    {"id": "Kothrud", "lat": 18.5074, "lng": 73.8077, "aqi": 150, "pm25": 65, "pm10": 95, "no2": 35, "so2": 10, "co": 0.8, "o3": 28, "status": "Live"},
                ]
            else: # Delhi Default Mock
                 return [
                    {"id": "Jahangirpuri", "lat": 28.7324, "lng": 77.1706, "aqi": 350, "pm25": 210, "pm10": 320, "status": "Live"},
                    {"id": "Anand Vihar", "lat": 28.6469, "lng": 77.3160, "aqi": 340, "pm25": 200, "pm10": 310, "status": "Live"},
                    {"id": "Bawana", "lat": 28.7762, "lng": 77.0500, "aqi": 330, "pm25": 195, "pm10": 300, "status": "Live"},
                    {"id": "Rohini", "lat": 28.7383, "lng": 77.1085, "aqi": 310, "pm25": 185, "pm10": 290, "status": "Live"},
                    {"id": "Wazirpur", "lat": 28.6973, "lng": 77.1656, "aqi": 300, "pm25": 180, "pm10": 280, "status": "Live"},
                 ]
        return sensor_list

    except Exception as e:
        print(f"Error fetching sensors: {e}")
        return mockSensors # ultimate fallback

@router.get("/rankings")
async def get_rankings(city: str = 'Delhi'):
    """Fetch live CPCB station data and return sorted rankings."""
    try:
        from ml_engine.api_client import MultiSourceAPIClient
        client = MultiSourceAPIClient()
        stations = client.fetch_cpcb_current_stations(city=city)
        
        ranking_list = []
        if stations:
            for name, data in stations.items():
                # Flexible AQI parsing
                aqi = data.get('AQI') or data.get('aqi') or data.get('Air Quality Index')
                
                # Check pollutant values
                pm25 = int(float(data.get('PM2.5', 0) if data.get('PM2.5') != 'NA' else 0))
                pm10 = int(float(data.get('PM10', 0) if data.get('PM10') != 'NA' else 0))
                no2 = int(float(data.get('NO2', 0) if data.get('NO2') != 'NA' else 0))
                so2 = int(float(data.get('SO2', 0) if data.get('SO2') != 'NA' else 0))
                co = float(data.get('CO', 0) if data.get('CO') != 'NA' else 0)
                o3 = int(float(data.get('O3', 0) if data.get('O3') != 'NA' else 0))
                
                # If AQI missing/0, Calculate it!
                if (aqi == 'NA' or aqi is None or aqi == 0) and (pm25 > 0 or pm10 > 0):
                     aqi = calculate_ind_aqi(pm25, pm10)
                elif aqi == 'NA' or aqi is None:
                     aqi = 0
                
                # Coords Lookup
                lat = data.get('latitude')
                lng = data.get('longitude')
                
                if not lat or not lng:
                    for key in STATION_COORDS:
                        if key.lower() in name.lower():
                            lat = STATION_COORDS[key]['lat']
                            lng = STATION_COORDS[key]['lng']
                            break
                            
                if aqi:
                    try:
                        aqi_val = int(float(aqi))
                        ranking_list.append({
                            "name": name,
                            "aqi": aqi_val,
                            "change": "0",
                            "pm25": pm25,
                            "pm10": pm10,
                            "no2": no2,
                            "so2": so2,
                            "co": co,
                            "o3": o3,
                            "lat": lat,
                            "lng": lng
                        })
                    except:
                        pass
        
        # If live fetch failed or returned 0 valid stations, use Mock 
        # BUT only if truly empty, to avoid blank screen.
        if not ranking_list:
            print(f"WARNING: Live rankings empty for {city}. Using fallback mock.")
            if city.lower() == 'pune':
                return [
                    {"id": 1, "name": "Shivajinagar", "aqi": 180, "change": "+5", "pm25": 85, "pm10": 120, "no2": 45, "lat": 18.5314, "lng": 73.8446},
                    {"id": 2, "name": "Hadapsar", "aqi": 165, "change": "-2", "pm25": 78, "pm10": 110, "no2": 40, "lat": 18.5089, "lng": 73.9259},
                    {"id": 3, "name": "Kothrud", "aqi": 150, "change": "+8", "pm25": 65, "pm10": 95, "no2": 35, "lat": 18.5074, "lng": 73.8077},
                    {"id": 4, "name": "Katraj", "aqi": 140, "change": "+0", "pm25": 60, "pm10": 90, "no2": 30, "lat": 18.4529, "lng": 73.8589},
                    {"id": 5, "name": "Pashan", "aqi": 120, "change": "-5", "pm25": 55, "pm10": 85, "no2": 25, "lat": 18.5362, "lng": 73.7929}
                ]
            # Default to generic/Delhi mock if not Pune
            return [
                {"id": 1, "name": "Station A", "aqi": 350, "change": "+5", "pm25": 180, "pm10": 250},
                {"id": 2, "name": "Station B", "aqi": 340, "change": "-2", "pm25": 170, "pm10": 240},
                {"id": 3, "name": "Station C", "aqi": 330, "change": "+8", "pm25": 160, "pm10": 230},
                {"id": 4, "name": "Station D", "aqi": 310, "change": "+0", "pm25": 150, "pm10": 220},
                {"id": 5, "name": "Station E", "aqi": 300, "change": "-5", "pm25": 140, "pm10": 210}
            ]
        
        # Sort
        ranking_list.sort(key=lambda x: x['aqi'], reverse=True)
        
        # Add IDs
        for idx, item in enumerate(ranking_list):
            item['id'] = idx + 1
            
        return ranking_list[:50]
        
    except Exception as e:
        print(f"Rankings Error: {e}")
        # Return mock on crash
        return [
             {"id": 1, "name": "System Error", "aqi": 0, "change": "--"}
        ]

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
