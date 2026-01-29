from fastapi import APIRouter, HTTPException
from datetime import timedelta
import pandas as pd
import asyncio

router = APIRouter()

# --- ML Environment Setup ---
try:
    from ml_engine.forecast_3day import load_model, prepare_historical_data, forecast_next_hours
    from ml_engine.aqi_calculator import get_aqi_category
    ML_AVAILABLE = True
except ImportError as e:
    print(f"ML Module import failed: {e}")
    ML_AVAILABLE = False

# Global ML components - dictionary to support multiple cities
ml_components = {
    'Delhi': {'model': None, 'scaler': None, 'features': None},
    'Pune': {'model': None, 'scaler': None, 'features': None}
}

async def init_ml():
    global ml_components
    if ML_AVAILABLE:
        try:
            print("Loading ML model components for cities...")
            for city in ['Delhi', 'Pune']:
                model, scaler, feature_names = load_model(city=city)
                if model:
                    ml_components[city] = {
                        'model': model,
                        'scaler': scaler,
                        'features': feature_names
                    }
                    print(f"ML components for {city} loaded successfully.")
                else:
                    print(f"Failed or skipped loading {city} model (file not found?)")
                    
        except Exception as e:
            print(f"Failed to load ML models: {e}")

@router.on_event("startup")
async def startup_event():
    await init_ml()

@router.get("/forecast-3day")
async def get_ml_forecast(city: str = 'Delhi'):
    """Get 3-day AQI forecast using the XGBoost model."""
    if not ML_AVAILABLE:
        raise HTTPException(status_code=503, detail="ML module not available (dependencies missing?)")
    
    # Normalize city input?
    target_city = 'Pune' if city.lower() == 'pune' else 'Delhi'
    
    components = ml_components.get(target_city)
    if not components or not components['model']:
        # Try fallback to Delhi if Pune fails? Or raise Error?
        # Better to raise error if requested city not available
        if target_city == 'Pune' and not components['model']:
             print(f"Pune model not loaded. Fallback to Delhi?? No, return error.")
             # Actually for hackathon, maybe fallback to Delhi model but tell user?
             # Let's try to stick to requested city.
             pass
    
    if not components or not components['model']:
        # Last resort fallback to whatever is loaded
        # if ml_components['Delhi']['model']:
        #    components = ml_components['Delhi']
        # else:
            raise HTTPException(status_code=503, detail=f"ML Model not loaded/initialized for {target_city}")
    
    ml_model = components['model']
    ml_scaler = components['scaler']
    ml_features = components['features']
    
    try:
        # Load data for specific city
        df = prepare_historical_data(city=target_city)
        
        if df is None:
             raise HTTPException(status_code=404, detail=f"Insufficient data for {target_city}")
        
        # Generate forecast
        forecasts = forecast_next_hours(ml_model, ml_scaler, ml_features, df, hours=72)
        return forecasts
        
    except Exception as e:
        print(f"Prediction error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/history")
async def get_ml_history(city: str = 'Delhi', days: int = 7):
    """Get historical AQI data for charts using OpenWeatherMap."""
    try:
        from ml_engine.api_client import MultiSourceAPIClient
        client = MultiSourceAPIClient()
        
        # Use simple OWM fetch
        df = client.fetch_history_data(city=city, days=days)
        
        if df is None or df.empty:
             raise HTTPException(status_code=404, detail=f"No history data for {city}")
        
        # Format for frontend
        output = []
        for _, row in df.iterrows():
            output.append({
                "datetime": row['Datetime'].isoformat(),
                "hour": row['Datetime'].hour,
                "aqi": int(row['AQI_computed']) if pd.notnull(row['AQI_computed']) else 0,
                "type": "measured" 
            })
            
        return output
        
    except Exception as e:
        print(f"History fetch error: {e}")
        # Return empty list or basic fallback instead of crash
        return []
