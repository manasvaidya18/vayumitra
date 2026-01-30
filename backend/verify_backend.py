
import sys
import os
import asyncio
from fastapi.testclient import TestClient

# Add current directory to sys.path
sys.path.append(os.getcwd())

# Import app
try:
    from main import app
except ImportError as e:
    print(f"Failed to import app: {e}")
    sys.exit(1)

def test_backend():
    print("Testing Backend Endpoints...")
    with TestClient(app) as client:
        # Test Root
        try:
            res = client.get("/")
            print(f"ROOT /: {res.status_code} {res.json()}")
        except Exception as e:
            print(f"ROOT / Failed: {e}")

        # Test Citizen AQI
        try:
            res = client.get("/api/citizen/aqi?city=Delhi")
            print(f"GET /api/citizen/aqi: {res.status_code}")
            if res.status_code == 200:
                data = res.json()
                print(f"AQI Data keys: {list(data.keys())}")
                print(f"AQI Value: {data.get('aqi')}")
            else:
                print(f"Error: {res.text}")
        except Exception as e:
            print(f"/api/citizen/aqi Failed: {e}")

        # Test ML Forecast
        try:
            res = client.get("/api/ml/forecast-3day?city=Delhi")
            print(f"GET /api/ml/forecast-3day: {res.status_code}")
            if res.status_code == 200:
                data = res.json()
                print(f"Forecast items: {len(data)}")
                if len(data) > 0:
                    print(f"First forecast: {data[0]}")
            else:
                print(f"Error: {res.text}")
        except Exception as e:
            print(f"/api/ml/forecast-3day Failed: {e}")

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    test_backend()
