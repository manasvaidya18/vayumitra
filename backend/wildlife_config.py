
# backend/wildlife_config.py

SPECIES_CONFIG = [
    # --- COMMON URBAN (All Cities) ---
    {
        'id': 'sparrow',
        'name': 'House Sparrow',
        'scientific_name': 'Passer domesticus',
        'icon': '🐦',
        'baseline': 95,
        'status': 'Near Threatened',
        'cities': ['Mumbai', 'Pune', 'Delhi'],
        'description': 'Once common, now struggling due to lack of nesting spaces and pollution.',
        'pollutant_sensitivity': {
            'pm2_5': 0.85, 
            'pm10': 0.6,
            'no2': 0.5,
            'o3': 0.4,
            'so2': 0.4
        },
        'seasonal_variation': { 'spring': 1.1, 'summer': 1.0, 'autumn': 0.9, 'winter': 0.7 }
    },
    {
        'id': 'pigeon',
        'name': 'Rock Pigeon',
        'scientific_name': 'Columba livia',
        'icon': '🕊️',
        'baseline': 100,
        'status': 'Least Concern',
        'cities': ['Mumbai', 'Pune', 'Delhi'],
        'description': 'Highly adapted to urban concrete jungles.',
        'pollutant_sensitivity': {
            'pm2_5': 0.2, 'pm10': 0.3, 'no2': 0.2, 'o3': 0.2, 'so2': 0.2
        },
        'seasonal_variation': { 'spring': 1.0, 'summer': 1.0, 'autumn': 1.0, 'winter': 0.95 }
    },

    # --- MUMBAI SPECIALS ---
    {
        'id': 'flamingo',
        'name': 'Lesser Flamingo',
        'scientific_name': 'Phoeniconaias minor',
        'icon': '🦩',
        'baseline': 88,
        'status': 'Near Threatened',
        'cities': ['Mumbai'],
        'description': 'Winter visitor to Mumbai mudflats (Sewri/Thane), sensitive to water/air quality.',
        'pollutant_sensitivity': {
            'pm2_5': 0.5, 
            'pm10': 0.4,
            'no2': 0.3,
            'o3': 0.3,
            'so2': 0.8 # Sensitive to industrial waste in water/air
        },
        'seasonal_variation': { 'spring': 0.5, 'summer': 0.2, 'autumn': 0.8, 'winter': 1.2 } # Present in Winter
    },
    {
        'id': 'coppersmith',
        'name': 'Coppersmith Barbet',
        'scientific_name': 'Psilopogon haemacephalus',
        'icon': '🦜',
        'baseline': 92,
        'status': 'Least Concern',
        'cities': ['Mumbai', 'Pune'],
        'description': 'Tree-dwelling fruit eater, needs old trees for nesting.',
        'pollutant_sensitivity': {
            'pm2_5': 0.6, 'pm10': 0.5, 'no2': 0.4, 'o3': 0.5, 'so2': 0.3
        },
        'seasonal_variation': { 'spring': 1.2, 'summer': 1.1, 'autumn': 1.0, 'winter': 0.9 }
    },

    # --- PUNE SPECIALS ---
    {
        'id': 'sunbird',
        'name': 'Purple Sunbird',
        'scientific_name': 'Cinnyris asiaticus',
        'icon': '🦅',
        'baseline': 94,
        'status': 'Least Concern',
        'cities': ['Pune', 'Mumbai'],
        'description': 'Nectar feeder, indicator of floral health and garden ecosystems.',
        'pollutant_sensitivity': {
            'pm2_5': 0.7, # High metabolic rate
            'pm10': 0.5,
            'no2': 0.6,
            'o3': 0.7, # Sensitive to smog affecting flowers
            'so2': 0.4
        },
        'seasonal_variation': { 'spring': 1.3, 'summer': 1.0, 'autumn': 0.9, 'winter': 0.8 }
    },
    {
        'id': 'owlet',
        'name': 'Spotted Owlet',
        'scientific_name': 'Athene brama',
        'icon': '🦉',
        'baseline': 90,
        'status': 'Least Concern',
        'cities': ['Pune', 'Delhi'],
        'description': 'Nocturnal predator controlling rodent population.',
        'pollutant_sensitivity': {
            'pm2_5': 0.5, 'pm10': 0.5, 'no2': 0.4, 'o3': 0.3, 'so2': 0.3
        },
        'seasonal_variation': { 'spring': 1.0, 'summer': 1.0, 'autumn': 1.0, 'winter': 1.0 }
    },

    # --- DELHI SPECIALS ---
    {
        'id': 'kite',
        'name': 'Black Kite',
        'scientific_name': 'Milvus migrans',
        'icon': '🦅',
        'baseline': 96,
        'status': 'Least Concern',
        'cities': ['Delhi'],
        'description': 'Scavenger raptor common in Delhi skies, vulnerable to bio-accumulation.',
        'pollutant_sensitivity': {
            'pm2_5': 0.6, 
            'pm10': 0.7, # Dust storms in Delhi
            'no2': 0.5,
            'o3': 0.5,
            'so2': 0.4
        },
        'seasonal_variation': { 'spring': 1.1, 'summer': 0.9, 'autumn': 1.0, 'winter': 0.8 }
    },
    {
        'id': 'parakeet',
        'name': 'Rose-ringed Parakeet',
        'scientific_name': 'Psittacula krameri',
        'icon': '🦜',
        'baseline': 93,
        'status': 'Least Concern',
        'cities': ['Delhi', 'Pune'],
        'description': 'Cavity nester, sensitive to smog and tree loss.',
        'pollutant_sensitivity': {
            'pm2_5': 0.6, 'pm10': 0.6, 'no2': 0.5, 'o3': 0.6, 'so2': 0.4
        },
        'seasonal_variation': { 'spring': 1.2, 'summer': 1.0, 'autumn': 0.9, 'winter': 0.7 }
    }
]

# Standard Safe Limits (NAAQS India / WHO approx)
SAFE_LIMITS = {
    'pm2_5': 60,   
    'pm10': 100,   
    'no2': 80,     
    'o3': 100,     
    'so2': 80,     
    'co': 2000     
}
