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

def getHealthRiskData(age=30, conditions=[]):
    baseRisk = 65 if age > 60 else (45 if age > 40 else 25)
    conditionRisk = len(conditions) * 15
    totalRisk = min(baseRisk + conditionRisk, 95)
    
    return {
        "risk": totalRisk,
        "level": 'High' if totalRisk > 70 else ('Moderate' if totalRisk > 40 else 'Low'),
        "color": '#ef4444' if totalRisk > 70 else ('#f59e0b' if totalRisk > 40 else '#22c55e'),
        "recommendations": [
            'Avoid outdoor activities during peak hours' if totalRisk > 70 else 'Moderate outdoor activities recommended',
            'Wear N95 mask when outdoors',
            'Keep windows closed during high pollution',
            'Use air purifier indoors'
        ]
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
