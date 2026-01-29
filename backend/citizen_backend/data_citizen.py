from datetime import datetime

def getAQIData():
    return {
        "aqi": 199,
        "level": 'Moderate',
        "color": '#f59e0b',
        "location": 'Pimpri, Maharashtra',
        "lastUpdated": datetime.now().isoformat(),
        "pollutants": [
            { "name": 'PM2.5', "value": 45, "unit": 'µg/m³', "status": 'Moderate', "color": '#f59e0b' },
            { "name": 'PM10', "value": 78, "unit": 'µg/m³', "status": 'Moderate', "color": '#f59e0b' },
            { "name": 'O3', "value": 32, "unit": 'ppb', "status": 'Good', "color": '#22c55e' },
            { "name": 'NO2', "value": 28, "unit": 'ppb', "status": 'Good', "color": '#22c55e' },
            { "name": 'SO2', "value": 12, "unit": 'ppb', "status": 'Good', "color": '#22c55e' },
            { "name": 'CO', "value": 0.8, "unit": 'ppm', "status": 'Good', "color": '#22c55e' },
        ]
    }

def getCleanAirScore():
    return {
        "score": 73,
        "trend": 'up',
        "change": 5,
        "insights": [
            'Air quality improved by 5% this week',
            'Peak pollution hours: 8-10 AM',
            'Weekends show 15% better air quality'
        ],
        "historicalData": [
            { "date": 'Mon', "score": 68 },
            { "date": 'Tue', "score": 71 },
            { "date": 'Wed', "score": 69 },
            { "date": 'Thu', "score": 72 },
            { "date": 'Fri', "score": 70 },
            { "date": 'Sat', "score": 75 },
            { "date": 'Sun', "score": 73 },
        ]
    }

def getHealthRiskData(age_group="30-40", conditions=[]):
    # 1. Get Current AQI (using internal function)
    current_aqi_data = getAQIData()
    aqi = current_aqi_data['aqi']
    
    # 2. Base Risk from AQI
    aqi_risk = 0
    if aqi > 300: aqi_risk = 80
    elif aqi > 200: aqi_risk = 60
    elif aqi > 100: aqi_risk = 40
    else: aqi_risk = 10

    # 3. Age Group Factor
    age_risk = 0
    # Higher risk for children and elderly
    if age_group in ["0-10", "70+", "80+", "90-100", "100+"]:
        age_risk = 30
    elif age_group in ["10-20", "60-70"]:
        age_risk = 20
    else:
        age_risk = 5

    # 4. Conditions Factor
    condition_risk = 0
    respiratory_issues = ['Asthma', 'COPD', 'Lung Cancer', 'Bronchitis']
    cardio_issues = ['Heart Disease', 'Hypertension']
    
    has_respiratory = any(c in respiratory_issues for c in conditions)
    has_cardio = any(c in cardio_issues for c in conditions)

    if has_respiratory:
        condition_risk += 40
    if has_cardio:
        condition_risk += 30
    
    # Add minor risk for other conditions
    other_conditions = [c for c in conditions if c not in respiratory_issues and c not in cardio_issues]
    condition_risk += len(other_conditions) * 10

    # 5. Calculate Total Risk
    # Formula: AQI contributes 40%, Medical 40%, Age 20% ? 
    # Or just additive with a cap
    
    total_risk = base_risk_calc = aqi_risk + age_risk + condition_risk
    
    # Amplifiers
    if aqi > 150 and (has_respiratory or has_cardio):
        total_risk += 20 # Sinergy effect
        
    total_risk = min(total_risk, 99) # Cap at 99%
    total_risk = max(total_risk, 1)  # Min 1%

    # 6. Generate Recommendations
    recommendations = []
    
    # General AQI Recs
    if aqi > 200:
        recommendations.append("Air quality is Poor. Stay indoors as much as possible.")
        recommendations.append("Use an air purifier with HEPA filters.")
    elif aqi > 100:
        recommendations.append("Limit prolonged outdoor exertion.")
    
    # Condition Specific Recs combined with AQI
    if has_respiratory:
        recommendations.append(f"Since you have respiratory conditions, keep inhalers handy.")
        if aqi > 100:
            recommendations.append("Wear an N95 mask strictly if stepping out.")
    
    if has_cardio and aqi > 150:
         recommendations.append("Avoid strenuous exercise which puts stress on the heart.")

    # Age Specific Recs
    if age_group in ["0-10"]:
        if aqi > 150: recommendations.append("Children should avoid outdoor play.")
    elif age_group in ["60-70", "70+", "80+", "90-100", "100+"]:
        recommendations.append("Elderly should maintain regular health checkups during high pollution days.")

    # Default fallback
    if len(recommendations) == 0:
        recommendations.append("Air quality is good. Enjoy outdoor activities!")
        recommendations.append("Ventilate your home to let fresh air in.")

    return {
        "risk": total_risk,
        "level": 'High' if total_risk > 70 else ('Moderate' if total_risk > 35 else 'Low'),
        "color": '#ef4444' if total_risk > 70 else ('#f59e0b' if total_risk > 35 else '#22c55e'),
        "recommendations": recommendations[:4] # Return top 4
    }

def getBestTimeData():
    return [
        { "hour": '6 AM', "aqi": 58, "weather": 'Clear', "safe": True },
        { "hour": '7 AM', "aqi": 72, "weather": 'Clear', "safe": True },
        { "hour": '8 AM', "aqi": 95, "weather": 'Cloudy', "safe": False },
        { "hour": '9 AM', "aqi": 108, "weather": 'Cloudy', "safe": False },
        { "hour": '10 AM', "aqi": 115, "weather": 'Cloudy', "safe": False },
        { "hour": '11 AM', "aqi": 102, "weather": 'Partly Cloudy', "safe": False },
        { "hour": '12 PM', "aqi": 88, "weather": 'Partly Cloudy', "safe": True },
        { "hour": '1 PM', "aqi": 82, "weather": 'Clear', "safe": True },
        { "hour": '2 PM', "aqi": 76, "weather": 'Clear', "safe": True },
        { "hour": '3 PM', "aqi": 78, "weather": 'Clear', "safe": True },
        { "hour": '4 PM', "aqi": 85, "weather": 'Clear', "safe": True },
        { "hour": '5 PM', "aqi": 92, "weather": 'Cloudy', "safe": False },
        { "hour": '6 PM', "aqi": 105, "weather": 'Cloudy', "safe": False },
        { "hour": '7 PM', "aqi": 98, "weather": 'Clear', "safe": False },
        { "hour": '8 PM', "aqi": 85, "weather": 'Clear', "safe": True },
    ]

def getShockPredictorData():
    return {
        "alerts": [
            {
                "id": 1,
                "type": 'warning',
                "title": 'Pollution Spike Expected',
                "time": 'Tomorrow 8-10 AM',
                "severity": 'Moderate',
                "message": 'AQI expected to reach 150+ due to traffic congestion'
            },
            {
                "id": 2,
                "type": 'info',
                "title": 'Weather Alert',
                "time": 'Next 3 days',
                "severity": 'Low',
                "message": 'Low wind conditions may trap pollutants'
            }
        ],
        "predictionData": [
            { "time": 'Now', "aqi": 87, "predicted": False },
            { "time": '+2h', "aqi": 95, "predicted": True },
            { "time": '+4h', "aqi": 102, "predicted": True },
            { "time": '+6h', "aqi": 125, "predicted": True },
            { "time": '+8h', "aqi": 148, "predicted": True },
            { "time": '+10h', "aqi": 138, "predicted": True },
            { "time": '+12h', "aqi": 115, "predicted": True },
        ]
    }

def getGreenSuggestions():
    return [
        {
            "id": 1,
            "title": 'Plant Native Trees',
            "impact": 85,
            "category": 'Plantation',
            "icon": 'Trees',
            "description": 'Planting 50 native trees can reduce PM2.5 by 15% in your area',
            "actionable": True,
            "cost": 'Low',
            "timeframe": '6 months'
        },
        {
            "id": 2,
            "title": 'Use Public Transport',
            "impact": 72,
            "category": 'Transport',
            "icon": 'Bus',
            "description": 'Switching to public transport can reduce CO emissions by 2.5kg/day',
            "actionable": True,
            "cost": 'Very Low',
            "timeframe": 'Immediate'
        },
        {
            "id": 3,
            "title": 'Install Air Purifiers',
            "impact": 68,
            "category": 'Indoor',
            "icon": 'Wind',
            "description": 'HEPA filters can improve indoor air quality by 90%',
            "actionable": True,
            "cost": 'Medium',
            "timeframe": 'Immediate'
        },
        {
            "id": 4,
            "title": 'Create Green Roofs',
            "impact": 78,
            "category": 'Infrastructure',
            "icon": 'Home',
            "description": 'Green roofs reduce urban heat and absorb pollutants',
            "actionable": False,
            "cost": 'High',
            "timeframe": '1 year'
        },
        {
            "id": 5,
            "title": 'Carpool to Work',
            "impact": 65,
            "category": 'Transport',
            "icon": 'Users',
            "description": 'Carpooling reduces vehicle emissions by 50%',
            "actionable": True,
            "cost": 'Very Low',
            "timeframe": 'Immediate'
        }
    ]

def getWildlifeData():
    return {
        "overallHealth": 62,
        "species": [
            {
                "name": 'Sparrows',
                "icon": 'Bird',
                "health": 58,
                "trend": 'declining',
                "population": 'Reduced by 25%',
                "risk": 'High',
                "color": '#ef4444'
            },
            {
                "name": 'Butterflies',
                "icon": 'Bug',
                "health": 45,
                "trend": 'declining',
                "population": 'Reduced by 40%',
                "risk": 'Critical',
                "color": '#dc2626'
            },
            {
                "name": 'Bees',
                "icon": 'Bug',
                "health": 52,
                "trend": 'stable',
                "population": 'Stable',
                "risk": 'Moderate',
                "color": '#f59e0b'
            },
            {
                "name": 'Squirrels',
                "icon": 'Squirrel',
                "health": 72,
                "trend": 'improving',
                "population": 'Stable',
                "risk": 'Low',
                "color": '#22c55e'
            }
        ],
        "impacts": [
            'Respiratory issues in birds due to PM2.5',
            'Decline in pollinator populations',
            'Reduced nesting success rates',
            'Food chain disruption'
        ]
    }

def getTreeImpactData():
    return {
        "currentAQI": 87,
        "projectedAQI": 65,
        "treesNeeded": 250,
        "co2Absorbed": '125 tons/year',
        "oxygenProduced": '90,000 kg/year',
        "impactAreas": [
            { "name": 'PM2.5 Reduction', "before": 45, "after": 32, "improvement": 29 },
            { "name": 'Temperature', "before": 32, "after": 28, "improvement": 12.5 },
            { "name": 'Oxygen Level', "before": 20.5, "after": 21.2, "improvement": 3.4 },
            { "name": 'Humidity', "before": 45, "after": 55, "improvement": 22 }
        ]
    }
