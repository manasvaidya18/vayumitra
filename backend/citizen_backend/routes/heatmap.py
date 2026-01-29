from fastapi import APIRouter, HTTPException
from ml_engine.heatmap_prediction import predictor

router = APIRouter(prefix="/api/policymaker", tags=["Policymaker"])

@router.get("/heatmap")
async def get_heatmap_data():
    """
    Get station-wise AQI predictions for the heatmap.
    Returns a list of stations with lat, lng, and predicted AQI.
    """
    try:
        data = await predictor.get_all_station_predictions()
        if not data:
            # Fallback or empty list if something deeper failed silently
            return []
        return data
    except Exception as e:
        print(f"Heatmap API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
