
# backend/wildlife_config.py

SPECIES_CONFIG = [
    {
        'id': 'sparrow',
        'name': 'House Sparrow',
        'icon': '🐦',
        'baseline': 95,
        'description': 'Small passerine birds highly sensitive to particulate matter.',
        'pollutant_sensitivity': {
            'pm2_5': 0.9,
            'pm10': 0.7,
            'no2': 0.6,
            'o3': 0.5,
            'so2': 0.4
        },
        'seasonal_variation': {
            'spring': 1.2,
            'summer': 1.0,
            'autumn': 0.9,
            'winter': 0.7
        }
    },
    {
        'id': 'butterfly',
        'name': 'Blue Mormon',
        'icon': '🦋',
        'baseline': 90,
        'description': 'Bio-indicator species vulnerable to chemical pollutants.',
        'pollutant_sensitivity': {
            'pm2_5': 0.7,
            'pm10': 0.6,
            'no2': 0.8,
            'o3': 0.9,
            'so2': 0.7
        },
        'seasonal_variation': {
            'spring': 1.5,
            'summer': 1.3,
            'autumn': 0.8,
            'winter': 0.1
        }
    },
    {
        'id': 'bee',
        'name': 'Indian Honey Bee',
        'icon': '🐝',
        'baseline': 85,
        'description': 'Critical pollinators affected by neurotoxic gases.',
        'pollutant_sensitivity': {
            'pm2_5': 0.6,
            'pm10': 0.5,
            'no2': 0.7,
            'o3': 0.8,
            'so2': 0.5
        },
        'seasonal_variation': {
            'spring': 1.4,
            'summer': 1.2,
            'autumn': 0.9,
            'winter': 0.2
        }
    },
    {
        'id': 'squirrel',
        'name': 'Palm Squirrel',
        'icon': '🐿️',
        'baseline': 98,
        'description': 'Resilient but respiratory systems affected by ozone.',
        'pollutant_sensitivity': {
            'pm2_5': 0.4,
            'pm10': 0.5,
            'no2': 0.3,
            'o3': 0.7,
            'so2': 0.2
        },
        'seasonal_variation': {
            'spring': 1.1,
            'summer': 1.2,
            'autumn': 1.0,
            'winter': 0.8
        }
    },
    {
        'id': 'robin',
        'name': 'Indian Robin',
        'icon': '🦅',
        'baseline': 92,
        'description': 'Ground foragers vulnerable to soil deposition.',
        'pollutant_sensitivity': {
            'pm2_5': 0.6,
            'pm10': 0.7,
            'no2': 0.5,
            'o3': 0.6,
            'so2': 0.4
        },
        'seasonal_variation': {
            'spring': 1.3,
            'summer': 1.1,
            'autumn': 1.0,
            'winter': 0.9
        }
    },
    {
        'id': 'roller',
        'name': 'Indian Roller',
        'icon': '🦜',
        'baseline': 94,
        'description': 'State bird of several states, moderate tolerance.',
        'pollutant_sensitivity': {
            'pm2_5': 0.5,
            'pm10': 0.6,
            'no2': 0.4,
            'o3': 0.5,
            'so2': 0.3
        },
        'seasonal_variation': {
            'spring': 1.0,
            'summer': 1.0,
            'autumn': 1.0,
            'winter': 1.0
        }
    },
    {
        'id': 'peacock',
        'name': 'Indian Peafowl',
        'icon': '🦚',
        'baseline': 88,
        'description': 'National bird, sensitive to noise and air quality.',
        'pollutant_sensitivity': {
            'pm2_5': 0.7,
            'pm10': 0.8,
            'no2': 0.6,
            'o3': 0.7,
            'so2': 0.6
        },
        'seasonal_variation': {
            'spring': 0.9,
            'summer': 1.1,
            'autumn': 1.0,
            'winter': 0.8
        }
    },
    {
        'id': 'woodpecker',
        'name': 'Flameback',
        'icon': '🪵',
        'baseline': 96,
        'description': 'Forest specialists sensitive to tree health.',
        'pollutant_sensitivity': {
            'pm2_5': 0.6,
            'pm10': 0.7,
            'no2': 0.5,
            'o3': 0.8,
            'so2': 0.7
        },
        'seasonal_variation': {
            'spring': 1.2,
            'summer': 1.0,
            'autumn': 0.9,
            'winter': 0.7
        }
    }
]
