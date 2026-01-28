# Mock Sensor Data
# Mock Sensor Data (Real Stations)
mockSensors = [
  { "id": 'Jahangirpuri', "zone": 'North', "location": 'Jahangirpuri', "aqi": 480, "status": 'online', "lat": 28.7328, "lng": 77.1706, "pm25": 350, "pm10": 280, "no2": 110, "o3": 20, "so2": 15, "co": 45 },
  { "id": 'Bawana', "zone": 'North West', "location": 'Bawana', "aqi": 490, "status": 'online', "lat": 28.7762, "lng": 77.0511, "pm25": 370, "pm10": 290, "no2": 45, "o3": 35, "so2": 10, "co": 50 },
  { "id": 'Chandni Chowk', "zone": 'Central', "location": 'Chandni Chowk', "aqi": 460, "status": 'online', "lat": 28.6568, "lng": 77.2272, "pm25": 340, "pm10": 300, "no2": 70, "o3": 25, "so2": 20, "co": 90 },
  { "id": 'Anand Vihar', "zone": 'East', "location": 'Anand Vihar', "aqi": 500, "status": 'online', "lat": 28.6476, "lng": 77.3160, "pm25": 400, "pm10": 380, "no2": 85, "o3": 15, "so2": 25, "co": 80 },
  { "id": 'Wazirpur', "zone": 'North', "location": 'Wazirpur', "aqi": 475, "status": 'online', "lat": 28.6998, "lng": 77.1654, "pm25": 360, "pm10": 310, "no2": 180, "o3": 40, "so2": 15, "co": 75 },
  { "id": 'Nehru Nagar', "zone": 'South', "location": 'Nehru Nagar', "aqi": 450, "status": 'online', "lat": 28.5678, "lng": 77.2505, "pm25": 330, "pm10": 280, "no2": 65, "o3": 50, "so2": 30, "co": 30 },
  { "id": 'Sonia Vihar', "zone": 'North East', "location": 'Sonia Vihar', "aqi": 455, "status": 'online', "lat": 28.7105, "lng": 77.2495, "pm25": 340, "pm10": 290, "no2": 68, "o3": 30, "so2": 12, "co": 90 },
  { "id": 'Vivek Vihar', "zone": 'East', "location": 'Vivek Vihar', "aqi": 465, "status": 'online', "lat": 28.6723, "lng": 77.3153, "pm25": 350, "pm10": 320, "no2": 78, "o3": 15, "so2": 14, "co": 65 },
  { "id": 'Mundka', "zone": 'West', "location": 'Mundka', "aqi": 470, "status": 'online', "lat": 28.6847, "lng": 77.0766, "pm25": 355, "pm10": 310, "no2": 85, "o3": 30, "so2": 16, "co": 40 },
  { "id": 'Rohini', "zone": 'North West', "location": 'Rohini', "aqi": 460, "status": 'online', "lat": 28.7325, "lng": 77.1199, "pm25": 345, "pm10": 300, "no2": 75, "o3": 35, "so2": 12, "co": 45 },
  { "id": 'Okhla Phase 2', "zone": 'South Each', "location": 'Okhla Phase 2', "aqi": 440, "status": 'online', "lat": 28.5308, "lng": 77.2713, "pm25": 320, "pm10": 280, "no2": 130, "o3": 45, "so2": 20, "co": 70 },
  { "id": 'Punjabi Bagh', "zone": 'West', "location": 'Punjabi Bagh', "aqi": 455, "status": 'online', "lat": 28.6683, "lng": 77.1167, "pm25": 330, "pm10": 270, "no2": 65, "o3": 18, "so2": 20, "co": 60 },
  { "id": 'R K Puram', "zone": 'South', "location": 'R K Puram', "aqi": 430, "status": 'online', "lat": 28.5632, "lng": 77.1869, "pm25": 310, "pm10": 240, "no2": 75, "o3": 35, "so2": 25, "co": 55 },
  { "id": 'Patparganj', "zone": 'East', "location": 'Patparganj', "aqi": 445, "status": 'online', "lat": 28.6238, "lng": 77.2872, "pm25": 325, "pm10": 260, "no2": 90, "o3": 30, "so2": 18, "co": 25 },
  { "id": 'DTU', "zone": 'North', "location": 'DTU', "aqi": 420, "status": 'online', "lat": 28.7501, "lng": 77.1113, "pm25": 300, "pm10": 230, "no2": 30, "o3": 18, "so2": 30, "co": 50 },
  { "id": 'Sirifort', "zone": 'South', "location": 'Sirifort', "aqi": 415, "status": 'online', "lat": 28.5504, "lng": 77.2159, "pm25": 290, "pm10": 250, "no2": 35, "o3": 22, "so2": 28, "co": 45 },
  { "id": 'Burari Crossing', "zone": 'North', "location": 'Burari', "aqi": 425, "status": 'online', "lat": 28.7256, "lng": 77.2012, "pm25": 305, "pm10": 260, "no2": 120, "o3": 15, "so2": 5, "co": 55 },
  { "id": 'ITO', "zone": 'Central', "location": 'ITO', "aqi": 410, "status": 'online', "lat": 28.6286, "lng": 77.2410, "pm25": 295, "pm10": 230, "no2": 85, "o3": 10, "so2": 18, "co": 50 },
  { "id": 'JLN Stadium', "zone": 'Central', "location": 'JLN Stadium', "aqi": 405, "status": 'online', "lat": 28.5802, "lng": 77.2338, "pm25": 290, "pm10": 250, "no2": 80, "o3": 25, "so2": 65, "co": 100 },
  { "id": 'Dwarka', "zone": 'South West', "location": 'Dwarka', "aqi": 400, "status": 'online', "lat": 28.6090, "lng": 77.0326, "pm25": 285, "pm10": 240, "no2": 100, "o3": 30, "so2": 25, "co": 45 }
]

# Mock Historical Data (7 days)
mockHistoricalData = [
  { "day": 'Mon', "aqi": 145, "pm25": 88, "pm10": 65, "no2": 48, "o3": 35, "so2": 25, "co": 14 },
  { "day": 'Tue', "aqi": 158, "pm25": 95, "pm10": 72, "no2": 52, "o3": 38, "so2": 28, "co": 15 },
  { "day": 'Wed', "aqi": 172, "pm25": 105, "pm10": 82, "no2": 58, "o3": 42, "so2": 32, "co": 17 },
  { "day": 'Thu', "aqi": 165, "pm25": 98, "pm10": 75, "no2": 55, "o3": 40, "so2": 30, "co": 16 },
  { "day": 'Fri', "aqi": 178, "pm25": 110, "pm10": 88, "no2": 62, "o3": 45, "so2": 35, "co": 18 },
  { "day": 'Sat', "aqi": 152, "pm25": 92, "pm10": 68, "no2": 50, "o3": 38, "so2": 28, "co": 15 },
  { "day": 'Sun', "aqi": 142, "pm25": 85, "pm10": 62, "no2": 45, "o3": 38, "so2": 22, "co": 12 }
]

# Mock Forecast Data (7 days)
mockForecastData = [
  { "day": 'Today', "date": '2024-02-05', "aqi": 178, "status": 'unhealthy', "confidence": 95 },
  { "day": '+1', "date": '2024-02-06', "aqi": 165, "status": 'unhealthy', "confidence": 88 },
  { "day": '+2', "date": '2024-02-07', "aqi": 142, "status": 'moderate', "confidence": 82 },
  { "day": '+3', "date": '2024-02-08', "aqi": 98, "status": 'moderate', "confidence": 75 },
  { "day": '+4', "date": '2024-02-09', "aqi": 85, "status": 'moderate', "confidence": 68 },
  { "day": '+5', "date": '2024-02-10', "aqi": 72, "status": 'moderate', "confidence": 62 },
  { "day": '+6', "date": '2024-02-11', "aqi": 65, "status": 'good', "confidence": 58 }
]

# Mock Hotspots Data
mockHotspots = [
  { "rank": 1, "location": 'Industrial Zone 3', "zone": 'B', "aqi": 312, "primarySource": 'Factories', "peakHours": '9AM-11AM', "duration": '18 hours/day', "population": 45000, "healthRisk": 'HIGH' },
  { "rank": 2, "location": 'Highway Junction', "zone": 'E', "aqi": 278, "primarySource": 'Vehicular', "peakHours": '8AM-10AM', "duration": '14 hours/day', "population": 38000, "healthRisk": 'HIGH' },
  { "rank": 3, "location": 'Power Plant Area', "zone": 'B', "aqi": 245, "primarySource": 'Industrial', "peakHours": '24/7', "duration": '24 hours/day', "population": 22000, "healthRisk": 'SEVERE' },
  { "rank": 4, "location": 'Bus Terminal', "zone": 'D', "aqi": 234, "primarySource": 'Vehicular', "peakHours": '7AM-9PM', "duration": '16 hours/day', "population": 52000, "healthRisk": 'HIGH' },
  { "rank": 5, "location": 'Market Area', "zone": 'D', "aqi": 212, "primarySource": 'Mixed', "peakHours": '10AM-8PM', "duration": '12 hours/day', "population": 68000, "healthRisk": 'MEDIUM' },
  { "rank": 6, "location": 'Construction Site', "zone": 'C', "aqi": 198, "primarySource": 'Dust', "peakHours": '9AM-6PM', "duration": '10 hours/day', "population": 15000, "healthRisk": 'MEDIUM' },
  { "rank": 7, "location": 'Traffic Circle', "zone": 'A', "aqi": 187, "primarySource": 'Vehicular', "peakHours": '8AM-10AM', "duration": '14 hours/day', "population": 42000, "healthRisk": 'MEDIUM' },
  { "rank": 8, "location": 'Industrial Park', "zone": 'B', "aqi": 176, "primarySource": 'Factories', "peakHours": '6AM-10PM', "duration": '16 hours/day', "population": 28000, "healthRisk": 'MEDIUM' },
  { "rank": 9, "location": 'Railway Station', "zone": 'A', "aqi": 165, "primarySource": 'Mixed', "peakHours": '6AM-11PM', "duration": '17 hours/day', "population": 75000, "healthRisk": 'MEDIUM' },
  { "rank": 10, "location": 'Airport Road', "zone": 'E', "aqi": 158, "primarySource": 'Vehicular', "peakHours": '24/7', "duration": '24 hours/day', "population": 32000, "healthRisk": 'LOW' }
]

# Mock Active Alerts
mockAlerts = [
  { "id": 1, "severity": 'severe', "title": 'Zone 5: AQI crossed 200', "description": 'Industrial area showing dangerous pollution levels', "time": '2 hours ago', "zone": 'E', "status": 'active' },
  { "id": 2, "severity": 'high', "title": 'Industrial area spike', "description": 'Factory emissions detected above normal', "time": '4 hours ago', "zone": 'B', "status": 'active' },
  { "id": 3, "severity": 'high', "title": 'Traffic congestion alert', "description": 'Heavy traffic causing pollution buildup', "time": '5 hours ago', "zone": 'D', "status": 'active' },
  { "id": 4, "severity": 'medium', "title": 'Construction dust warning', "description": 'Multiple construction sites active', "time": '1 day ago', "zone": 'C', "status": 'monitoring' },
  { "id": 5, "severity": 'medium', "title": 'Weather impact forecast', "description": 'Low wind conditions predicted', "time": '1 day ago', "zone": 'All', "status": 'monitoring' }
]

# Mock Health Data
mockHealthData = {
  "totalCases": 45230,
  "respiratoryCases": 15830,
  "cardiovascularCases": 9950,
  "bronchitisCases": 8140,
  "otherCases": 11310,
  "erVisits": 8920,
  "deaths": 892,
  "annualCost": 245000000000, # 2,450 Crores
  "trends": {
    "respiratory": 12,
    "cardiovascular": 8,
    "erVisits": 15,
    "deaths": 5
  }
}

# Mock Zone Health Impact
mockZoneHealthImpact = [
  { "zone": 'A', "population": 250000, "cases": 8450, "risk": 'HIGH', "aqiAvg": 142 },
  { "zone": 'B', "population": 180000, "cases": 12100, "risk": 'SEVERE', "aqiAvg": 245 },
  { "zone": 'C', "population": 320000, "cases": 4230, "risk": 'MEDIUM', "aqiAvg": 87 },
  { "zone": 'D', "population": 150000, "cases": 5780, "risk": 'HIGH', "aqiAvg": 178 },
  { "zone": 'E', "population": 420000, "cases": 14670, "risk": 'SEVERE', "aqiAvg": 212 }
]

# Mock Traffic Data
mockTrafficData = {
  "vehiclesOnRoad": 2400000,
  "congestionIndex": 78,
  "activeFactories": 142,
  "constructionSites": 45,
  "contributionToAQI": 42
}

# Mock Hourly Traffic Pattern
mockHourlyTraffic = [
  { "hour": '6AM', "count": 45000 },
  { "hour": '7AM', "count": 78000 },
  { "hour": '8AM', "count": 125000 },
  { "hour": '9AM', "count": 142000 },
  { "hour": '10AM', "count": 135000 },
  { "hour": '11AM', "count": 128000 },
  { "hour": '12PM', "count": 118000 },
  { "hour": '1PM', "count": 112000 },
  { "hour": '2PM', "count": 108000 },
  { "hour": '3PM', "count": 115000 },
  { "hour": '4PM', "count": 128000 },
  { "hour": '5PM', "count": 145000 },
  { "hour": '6PM', "count": 158000 },
  { "hour": '7PM', "count": 142000 },
  { "hour": '8PM', "count": 95000 },
  { "hour": '9PM', "count": 68000 }
]

# Mock Emission Sources
mockEmissionSources = [
  { "source": 'Private Cars', "contribution": 35, "icon": '🚗' },
  { "source": 'Trucks/Buses', "contribution": 28, "icon": '🚚' },
  { "source": '2-Wheelers', "contribution": 22, "icon": '🛵' },
  { "source": 'Industries', "contribution": 12, "icon": '🏭' },
  { "source": 'Construction', "contribution": 3, "icon": '🏗️' }
]

# Mock Congestion Hotspots
mockCongestionHotspots = [
  { "location": 'Highway Junction', "delay": 45, "peakTime": '9:00 AM', "aqiImpact": 35 },
  { "location": 'City Center', "delay": 32, "peakTime": '6:00 PM', "aqiImpact": 28 },
  { "location": 'Industrial Gate', "delay": 28, "peakTime": '8:00 AM', "aqiImpact": 42 },
  { "location": 'Market Road', "delay": 22, "peakTime": '5:00 PM', "aqiImpact": 18 }
]

# Mock Recent Reports
mockReports = [
  { "id": 1, "name": 'January Monthly Report', "type": 'PDF', "date": '2024-02-01', "size": '2.4 MB' },
  { "id": 2, "name": 'Week 4 Summary', "type": 'Excel', "date": '2024-01-28', "size": '850 KB' },
  { "id": 3, "name": 'Health Impact Q4', "type": 'PDF', "date": '2024-01-15', "size": '3.2 MB' },
  { "id": 4, "name": 'Policy Review 2023', "type": 'Word', "date": '2024-01-10', "size": '1.8 MB' },
  { "id": 5, "name": 'Daily Report 25/01', "type": 'PDF', "date": '2024-01-25', "size": '650 KB' }
]

# Mock Scheduled Reports
mockScheduledReports = [
  { "report": 'Daily Summary', "frequency": 'Daily', "nextRun": '2024-02-06 06:00 AM' },
  { "report": 'Weekly Review', "frequency": 'Weekly', "nextRun": '2024-02-11 08:00 AM' },
  { "report": 'Monthly Report', "frequency": 'Monthly', "nextRun": '2024-03-01 09:00 AM' },
  { "report": 'Compliance Audit', "frequency": 'Quarterly', "nextRun": '2024-04-01 10:00 AM' }
]

# Mock Weather Data
mockWeatherData = {
  "temperature": 32,
  "humidity": 65,
  "windSpeed": 12,
  "pressure": 1013,
  "rainProbability": 0,
  "trends": {
    "temperature": 'up',
    "humidity": 'down',
    "windSpeed": 'down',
    "pressure": 'neutral',
    "rain": 'neutral'
  },
  "impacts": {
    "temperature": 'worsens',
    "humidity": 'improves',
    "windSpeed": 'worsens',
    "pressure": 'neutral',
    "rain": 'improves'
  }
}

# Mock Source Attribution
mockSourceAttribution = [
  { "source": 'Industrial', "percentage": 45, "icon": '🏭', "color": '#ef4444' },
  { "source": 'Vehicular', "percentage": 28, "icon": '🚗', "color": '#f59e0b' },
  { "source": 'Construction', "percentage": 12, "icon": '🏗️', "color": '#f97316' },
  { "source": 'Burning', "percentage": 10, "icon": '🔥', "color": '#dc2626' },
  { "source": 'Other', "percentage": 5, "icon": '🌾', "color": '#94a3b8' }
]

# Mock Vulnerable Populations
mockVulnerablePopulations = [
  { "group": 'Children 0-5', "population": 180000, "risk": 4, "icon": '👶' },
  { "group": 'Elderly 60+', "population": 220000, "risk": 5, "icon": '👴' },
  { "group": 'Pregnant Women', "population": 65000, "risk": 4, "icon": '🤰' },
  { "group": 'Outdoor Workers', "population": 420000, "risk": 5, "icon": '👷' },
  { "group": 'Pre-existing Conditions', "population": 380000, "risk": 6, "icon": '🏥' }
]

# Mock Policy Simulation Results
mockPolicySimulation = {
  "currentAQI": 178,
  "projectedAQI": 108,
  "improvement": 39,
  "implementationCost": 45000000000, # 450 Crores
  "healthBenefits": 120000000000, # 1,200 Crores
  "roi": 2.7,
  "timeline": {
    "phase1": '0-3 months',
    "phase2": '3-6 months',
    "phase3": '6-12 months'
  },
  "impactBreakdown": {
    "vehicular": -35,
    "industrial": -42,
    "construction": -15
  },
  "healthImpact": {
    "casesReduced": 15000,
    "livesSaved": 450
  }
}
