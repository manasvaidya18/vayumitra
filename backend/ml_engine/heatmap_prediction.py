import pandas as pd
import numpy as np
import pickle
import os
from datetime import datetime
from ml_engine.api_client import fetch_live_weather_data, fetch_cpcb_station_data 

# Config
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "heatmap_model.pkl")
STATION_ENCODER_PATH = os.path.join(os.path.dirname(__file__), "models", "station_encoder.pkl")

# Station Coordinates (Should ideally be shared with prep script or loaded from file)
STATION_COORDS = {
    "Alipur": {"lat": 28.8153, "lng": 77.1530},
    "Anand Vihar": {"lat": 28.6476, "lng": 77.3160},
    "Ashok Vihar": {"lat": 28.6954, "lng": 77.1817},
    "Aya Nagar": {"lat": 28.4720, "lng": 77.1120},
    "Bawana": {"lat": 28.7762, "lng": 77.0511},
    "Burari Crossing": {"lat": 28.7256, "lng": 77.2012},
    "Chandni Chowk": {"lat": 28.6568, "lng": 77.2272},
    "CRRI Mathura Road": {"lat": 28.5512, "lng": 77.2736},
    "Dr. Karni Singh Shooting Range": {"lat": 28.4986, "lng": 77.2648},
    "DTU": {"lat": 28.7501, "lng": 77.1113},
    "Dwarka-Sector 8": {"lat": 28.5710, "lng": 77.0719},
    "IGI Airport (T3)": {"lat": 28.5567, "lng": 77.1000},
    "IHBAS": {"lat": 28.6811, "lng": 77.3025},
    "ITO": {"lat": 28.6286, "lng": 77.2410},
    "Jahangirpuri": {"lat": 28.7328, "lng": 77.1706},
    "Jawaharlal Nehru Stadium": {"lat": 28.5802, "lng": 77.2338},
    "Lodhi Road": {"lat": 28.5883, "lng": 77.2217},
    "Major Dhyan Chand National Stadium": {"lat": 28.6117, "lng": 77.2372},
    "Mandir Marg": {"lat": 28.6364, "lng": 77.1997},
    "Mundka": {"lat": 28.6847, "lng": 77.0766},
    "Najafgarh": {"lat": 28.6138, "lng": 76.9830},
    "Narela": {"lat": 28.8606, "lng": 77.0927},
    "Nehru Nagar": {"lat": 28.5678, "lng": 77.2505},
    "North Campus": {"lat": 28.6940, "lng": 77.2159},
    "NSIT Dwarka": {"lat": 28.6090, "lng": 77.0326},
    "Okhla Phase-2": {"lat": 28.5308, "lng": 77.2713},
    "Patparganj": {"lat": 28.6238, "lng": 77.2872},
    "Punjabi Bagh": {"lat": 28.6683, "lng": 77.1167},
    "Pusa": {"lat": 28.6396, "lng": 77.1463},
    "R K Puram": {"lat": 28.5632, "lng": 77.1869},
    "Rohini": {"lat": 28.7325, "lng": 77.1199},
    "Shadipur": {"lat": 28.6515, "lng": 77.1473},
    "Sirifort": {"lat": 28.5504, "lng": 77.2159},
    "Sonia Vihar": {"lat": 28.7105, "lng": 77.2495},
    "Sri Aurobindo Marg": {"lat": 28.5313, "lng": 77.1901},
    "Vivek Vihar": {"lat": 28.6723, "lng": 77.3153},
    "Wazirpur": {"lat": 28.6998, "lng": 77.1654}
}

class HeatmapPredictor:
    def __init__(self):
        try:
            with open(MODEL_PATH, 'rb') as f:
                self.model = pickle.load(f)
            with open(STATION_ENCODER_PATH, 'rb') as f:
                self.encoder = pickle.load(f)
            print("Heatmap model loaded successfully.")
        except Exception as e:
            print(f"Error loading heatmap model: {e}")
            self.model = None
            self.encoder = None

    async def get_all_station_predictions(self):
        if not self.model or not self.encoder:
            return []

        # Get Live Weather Data (City Level proxy)
        live_data = await fetch_live_weather_data()
        
        current_time = datetime.now()
        hour = current_time.hour
        month = current_time.month
        day_of_week = current_time.weekday()
        
        # Prepare input dataframe for all stations
        # Features: ['hour', 'month', 'day_of_week', 'Latitude', 'Longitude', 'Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh', 'station_encoded']
        
        stations = list(STATION_COORDS.keys())
        rows = []
        
        for station in stations:
            # Check if station was encoded during training
            if station not in self.encoder.classes_:
                continue
                
            coords = STATION_COORDS[station]
            
            # Use city-wide weather for now (or could use station specific if available)
            temp = float(live_data.get('main', {}).get('temp', 25.0))
            humidity = float(live_data.get('main', {}).get('humidity', 50.0))
            wind_speed = float(live_data.get('wind', {}).get('speed', 5.0)) * 3.6 # m/s to km/h
            
            rows.append({
                'hour': hour,
                'month': month,
                'day_of_week': day_of_week,
                'Latitude': coords['lat'],
                'Longitude': coords['lng'],
                'Temp_2m_C': temp,
                'Humidity_Percent': humidity,
                'Wind_Speed_10m_kmh': wind_speed,
                'StationName': station
            })
            
        if not rows:
            return []
            
        df = pd.DataFrame(rows)
        
        # Encode stations
        df['station_encoded'] = self.encoder.transform(df['StationName'])
        
        # Predict PM2.5 concentration
        features = ['hour', 'month', 'day_of_week', 'Latitude', 'Longitude', 'Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh', 'station_encoded']
        pm25_predictions = self.model.predict(df[features])
        
        # Fetch CPCB Ground Truth
        cpcb_data = await fetch_cpcb_station_data() or {}
        print(f"Loaded real-time data for {len(cpcb_data)} stations from CPCB.")

        results = []
        for i, pm25_pred in enumerate(pm25_predictions):
            station_name = df.iloc[i]['StationName']
            
            # Default to prediction
            final_pm25 = float(pm25_pred)
            source = "Predicted"
            
            # Override with Ground Truth if available
            # Matches keys like "Alipur", "Anand Vihar"
            # CPCB keys might be slightly different ("Alipur, Delhi"), check partial match handled in client or here
            if station_name in cpcb_data and "PM2.5" in cpcb_data[station_name]:
                final_pm25 = cpcb_data[station_name]["PM2.5"]
                source = "Real-time"
            
            def calculate_aqi_pm25(c):
                c = max(0, c)
                if c <= 30:
                    return c * (50/30)
                elif c <= 60:
                    return 50 + (c-30) * (50/30)
                elif c <= 90:
                    return 100 + (c-60) * (100/30)
                elif c <= 120:
                    return 200 + (c-90) * (100/30)
                elif c <= 250:
                    return 300 + (c-120) * (100/130)
                else:
                    return 400 + (c-250) * (100/130)

            if source == "Real-time":
                # CPCB OGD Resource 3b01... returns AQI Sub-indices in 'avg_value'
                # So we use the value directly as AQI
                aqi_val = final_pm25
            else:
                # For Model predictions, we predict Mass (µg/m³) -> Convert to AQI
                aqi_val = calculate_aqi_pm25(final_pm25)
            
            # Determine status
            status = "Good"
            if aqi_val > 50: status = "Satisfactory"
            if aqi_val > 100: status = "Moderate"
            if aqi_val > 200: status = "Poor"
            if aqi_val > 300: status = "Very Poor"
            if aqi_val > 400: status = "Severe"
            
            results.append({
                "station": station_name,
                "lat": df.iloc[i]['Latitude'],
                "lng": df.iloc[i]['Longitude'],
                "aqi": round(aqi_val),
                "status": status,
                "source": source,
                "last_updated": datetime.now().isoformat()
            })
            
        return results

predictor = HeatmapPredictor()
