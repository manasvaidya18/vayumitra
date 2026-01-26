import pandas as pd
import xgboost as xgb
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Config
DATA_PATH = r"c:\Users\UDAY THAKARE\Documents\AI-R\vayumitra\backend\ml_engine\data\delhi_stations_combined.csv"
MODEL_PATH = r"c:\Users\UDAY THAKARE\Documents\AI-R\vayumitra\backend\ml_engine\models\heatmap_model.pkl"
STATION_ENCODER_PATH = r"c:\Users\UDAY THAKARE\Documents\AI-R\vayumitra\backend\ml_engine\models\station_encoder.pkl"

def main():
    print("Loading data...")
    if not os.path.exists(DATA_PATH):
        print(f"Error: Data file not found at {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)
    
    # Feature Engineering
    # Convert Datetime
    df['Datetime'] = pd.to_datetime(df['Datetime'])
    df['hour'] = df['Datetime'].dt.hour
    df['month'] = df['Datetime'].dt.month
    df['day_of_week'] = df['Datetime'].dt.dayofweek
    
    # Encode Station Name
    le = LabelEncoder()
    df['station_encoded'] = le.fit_transform(df['StationName'])
    
    # Function to calculate AQI (Simplified for training target)
    def calculate_aqi(pm25, pm10):
        # Very simplified breakpoint logic for training target proxy
        # In production, we predict PM2.5 and PM10 separately then calc AQI
        # But for this heatmap model, we might want to predict AQI directly if simpler,
        # OR predict PM2.5 and PM10. 
        # Let's predict PM2.5 for now as the primary pollutant, then derive AQI logic in backend.
        return pm25 # Placeholder
    
    # Target: PM2.5 (can be used to derive AQI)
    target = 'PM2_5_ugm3'
    
    # Features
    features = ['hour', 'month', 'day_of_week', 'Latitude', 'Longitude', 'Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh', 'station_encoded']
    
    # Drop rows with missing target or features
    df = df.dropna(subset=[target] + features)
    
    X = df[features]
    y = df[target]
    
    print(f"Training on {len(X)} samples...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = xgb.XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        learning_rate=0.1,
        max_depth=7,
        random_state=42
    )
    
    model.fit(X_train, y_train)
    
    score = model.score(X_test, y_test)
    print(f"Model R^2 Score: {score:.4f}")
    
    # Save model and encoder
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
        
    with open(STATION_ENCODER_PATH, 'wb') as f:
        pickle.dump(le, f)
        
    print(f"Model saved to {MODEL_PATH}")
    print(f"Encoder saved to {STATION_ENCODER_PATH}")

if __name__ == "__main__":
    main()
