"""
Multi-Source API Client for AQI Data
Supports OpenAQ (historical) and OpenWeatherMap (real-time)
"""
import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path


class MultiSourceAPIClient:
    """
    Unified client for fetching AQI data from multiple sources.
    - OpenWeatherMap: Real-time data (recommended for continuous learning)
    - OpenAQ: Historical data backup
    """
    
    # City coordinates
    CITY_COORDS = {
        'Delhi': {'lat': 28.7041, 'lon': 77.1025},
        'Mumbai': {'lat': 19.0760, 'lon': 72.8777},
        'Bangalore': {'lat': 12.9716, 'lon': 77.5946},
        'Kolkata': {'lat': 22.5726, 'lon': 88.3639},
        'Pune': {'lat': 18.5204, 'lon': 73.8567}
    }
    
    def __init__(self, openweathermap_key=None, openaq_key=None):
        self.owm_key = openweathermap_key
        self.openaq_key = openaq_key
    
    def fetch_realtime_data(self, city='Delhi', hours=24):
        """
        Fetch real-time data using the best available source.
        Priority: OpenWeatherMap > OpenAQ > Simulated
        """
        print(f'\nFetching real-time data for {city}...')
        
        # Try OpenWeatherMap first (best for real-time)
        if self.owm_key and self.owm_key != 'YOUR_API_KEY_HERE':
            df = self._fetch_openweathermap(city, hours)
            if df is not None and len(df) > 0:
                return df
        
        # Try OpenAQ as backup
        if self.openaq_key:
            df = self._fetch_openaq(city, hours)
            if df is not None and len(df) > 0:
                return df
        
        # Fall back to simulated data
        print('[INFO] Using simulated data (no API keys or APIs unavailable)')
        return self._generate_simulated_data(city, hours)
    
    def _fetch_openweathermap(self, city, hours):
        """Fetch from OpenWeatherMap Air Pollution API."""
        try:
            coords = self.CITY_COORDS.get(city, self.CITY_COORDS['Delhi'])
            
            end_time = int(datetime.now().timestamp())
            start_time = int((datetime.now() - timedelta(hours=hours)).timestamp())
            
            url = "http://api.openweathermap.org/data/2.5/air_pollution/history"
            params = {
                'lat': coords['lat'],
                'lon': coords['lon'],
                'start': start_time,
                'end': end_time,
                'appid': self.owm_key
            }
            
            print(f'  Calling OpenWeatherMap API...')
            response = requests.get(url, params=params, timeout=30)
            
            if response.status_code != 200:
                print(f'  OpenWeatherMap error: {response.status_code}')
                return None
            
            data = response.json()
            
            if 'list' not in data:
                print('  Unexpected response format')
                return None
            
            records = []
            for item in data['list']:
                dt = datetime.fromtimestamp(item['dt'])
                components = item['components']
                
                record = {
                    'Datetime': dt,
                    'PM2_5_ugm3': components.get('pm2_5', np.nan),
                    'PM10_ugm3': components.get('pm10', np.nan),
                    'NO2_ugm3': components.get('no2', np.nan),
                    'CO_ugm3': components.get('co', np.nan),
                    'O3_ugm3': components.get('o3', np.nan),
                    'SO2_ugm3': components.get('so2', np.nan),
                    'Temp_2m_C': 25.0,  # OWM doesn't provide temp in this API
                    'Humidity_Percent': 60,
                    'Wind_Speed_10m_kmh': 10.0
                }
                records.append(record)
            
            df = pd.DataFrame(records)
            df = df.sort_values('Datetime')
            
            print(f'  [OK] Fetched {len(df)} records from OpenWeatherMap')
            return df
            
        except Exception as e:
            print(f'  OpenWeatherMap error: {e}')
            return None
    
    def _fetch_openaq(self, city, hours):
        """Fetch from OpenAQ API v3."""
        try:
            headers = {'X-API-Key': self.openaq_key}
            
            print(f'  Calling OpenAQ API...')
            
            # Get locations
            response = requests.get(
                'https://api.openaq.org/v3/locations',
                headers=headers,
                params={'limit': 500},
                timeout=30
            )
            
            if response.status_code != 200:
                print(f'  OpenAQ error: {response.status_code}')
                return None
            
            data = response.json()
            locations = data.get('results', [])
            
            # Find matching city locations
            city_lower = city.lower()
            matching = [l for l in locations if city_lower in l.get('name', '').lower()]
            
            if not matching:
                print(f'  No {city} locations found in OpenAQ')
                return None
            
            # Get latest readings from first matching location
            loc_id = matching[0].get('id')
            response = requests.get(
                f'https://api.openaq.org/v3/locations/{loc_id}/latest',
                headers=headers,
                timeout=30
            )
            
            if response.status_code != 200:
                print(f'  Error fetching measurements: {response.status_code}')
                return None
            
            latest = response.json().get('results', [])
            
            if not latest:
                print('  No recent measurements available')
                return None
            
            # Check if data is recent (within last week)
            for reading in latest:
                dt_str = reading.get('datetime', {}).get('utc', '')
                if dt_str:
                    dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
                    age = datetime.now(dt.tzinfo) - dt
                    if age.days > 7:
                        print(f'  OpenAQ data is {age.days} days old - too stale')
                        return None
            
            print(f'  [OK] Fetched {len(latest)} readings from OpenAQ')
            # Would need more processing to convert to hourly format
            # For now, just indicate it's available
            return None  # TODO: Implement full parsing
            
        except Exception as e:
            print(f'  OpenAQ error: {e}')
            return None
    
    def _generate_simulated_data(self, city, hours):
        """Generate realistic simulated data for demo/testing."""
        print(f'  Generating {hours} hours of simulated data...')
        
        # Base patterns by month
        current_month = datetime.now().month
        
        if current_month in [11, 12, 1, 2]:  # Winter - high pollution
            base_pm25 = 200
            base_aqi = 300
        elif current_month in [6, 7, 8, 9]:  # Monsoon - lower pollution
            base_pm25 = 80
            base_aqi = 150
        else:  # Transition
            base_pm25 = 120
            base_aqi = 200
        
        records = []
        now = datetime.now()
        
        for h in range(hours, 0, -1):
            dt = now - timedelta(hours=h)
            hour_of_day = dt.hour
            
            # Diurnal pattern
            if hour_of_day in [7, 8, 9, 18, 19, 20]:
                factor = 1.2  # Rush hour peak
            elif hour_of_day in [2, 3, 4, 5]:
                factor = 0.8  # Night low
            else:
                factor = 1.0
            
            noise = np.random.normal(0, 15)
            
            pm25 = max(10, base_pm25 * factor + noise)
            pm10 = max(20, pm25 * 1.7 + np.random.normal(0, 20))
            
            record = {
                'Datetime': dt,
                'PM2_5_ugm3': pm25,
                'PM10_ugm3': pm10,
                'NO2_ugm3': max(10, 60 * factor + np.random.normal(0, 10)),
                'CO_ugm3': max(200, 1500 * factor + np.random.normal(0, 200)),
                'O3_ugm3': max(5, 40 - noise * 0.3),  # Inverse pattern
                'SO2_ugm3': max(5, 25 + np.random.normal(0, 8)),
                'Temp_2m_C': 22 + np.random.normal(0, 3),
                'Humidity_Percent': min(100, max(30, 65 + np.random.normal(0, 10))),
                'Wind_Speed_10m_kmh': max(1, 10 + np.random.normal(0, 4))
            }
            records.append(record)
        
        df = pd.DataFrame(records)
        print(f'  [OK] Generated {len(df)} simulated records')
        return df


def test_client():
    """Test the multi-source client."""
    print('='*60)
    print('Multi-Source API Client Test')
    print('='*60)
    
    import os
    from dotenv import load_dotenv
    
    # Load env from parent directory (backend root)
    env_path = Path(__file__).parent.parent / '.env'
    load_dotenv(dotenv_path=env_path)
    
    owm_key = os.getenv("OPENWEATHERMAP_API_KEY")
    openaq_key = os.getenv("OPENAQ_API_KEY")
    
    print(f'Loaded API Keys: OWM={"Yes" if owm_key else "No"}, OpenAQ={"Yes" if openaq_key else "No"}')
    
    # Initialize with your keys
    client = MultiSourceAPIClient(
        openweathermap_key=owm_key,
        openaq_key=openaq_key
    )
    
    # Fetch data
    df = client.fetch_realtime_data('Delhi', hours=24)
    
    if df is not None:
        print('\n' + '='*60)
        print('Sample Data:')
        print('='*60)
        print(df.head(10).to_string())
        print(f'\nTotal records: {len(df)}')
        print(f'Date range: {df["Datetime"].min()} to {df["Datetime"].max()}')


if __name__ == '__main__':
    test_client()
