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

# Global ML components - in a real app these should be in dependencies or a state manager
ml_model = None
ml_scaler = None
ml_features = None

async def init_ml():
    global ml_model, ml_scaler, ml_features
    if ML_AVAILABLE:
        try:
            print("Loading ML model components...")
            # Run load_model in thread if it's blocking? It's loading from disk.
            ml_model, ml_scaler, ml_features = load_model()
            print("ML model loaded successfully.")
        except Exception as e:
            print(f"Failed to load ML model: {e}")

@router.on_event("startup")
async def startup_event():
    await init_ml()

@router.get("/forecast-3day")
async def get_ml_forecast():
    """Get 3-day AQI forecast using the XGBoost model."""
    if not ML_AVAILABLE:
        raise HTTPException(status_code=503, detail="ML module not available (dependencies missing?)")
    
    if not ml_model:
        raise HTTPException(status_code=503, detail="ML Model not loaded/initialized")
    
    try:
        # Load data (simulated real-time fetch)
        df = prepare_historical_data()
        
        # Generate forecast
        forecasts = forecast_next_hours(ml_model, ml_scaler, ml_features, df, hours=72)
        return forecasts
        
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/history")
async def get_ml_history(days: int = 7):
    """Get historical AQI data for model accuracy comparison."""
    if not ML_AVAILABLE:
        raise HTTPException(status_code=503, detail="ML module not available")
    
    try:
        # Load historical data (CSV + Live)
        df = prepare_historical_data()
        
        # Filter for requested duration
        cutoff_date = pd.Timestamp.now().tz_localize(None) - timedelta(days=days)
        
        # Ensure regex/format match
        if df['Datetime'].dt.tz is not None:
             df['Datetime'] = df['Datetime'].dt.tz_localize(None)
             
        recent_history = df[df['Datetime'] >= cutoff_date].copy()
        
        # Format for frontend
        output = []
        for _, row in recent_history.iterrows():
            output.append({
                "datetime": row['Datetime'].isoformat(),
                "hour": row['Datetime'].hour,
                "aqi": int(row['AQI_computed']) if pd.notnull(row['AQI_computed']) else 0,
                "type": "measured" 
            })
            
        return output
        
    except Exception as e:
        print(f"History fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
