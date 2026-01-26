import os
import pandas as pd
import re

# Source directory containing the 78 station CSVs
SOURCE_DIR = r"c:\Users\UDAY THAKARE\Documents\AI-R\delhi_all_stations_24-25\delhi_all_stations_24-25"
OUTPUT_FILE = r"c:\Users\UDAY THAKARE\Documents\AI-R\vayumitra\backend\ml_engine\data\delhi_stations_combined.csv"

# Known coordinates for Delhi stations (approximate)
# In a real scenario, we would use an official metadata file.
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
    "IHBAS": {"lat": 28.6811, "lng": 77.3025}, # Dilshad Garden
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
    "North Campus": {"lat": 28.6940, "lng": 77.2159}, # DU
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

def clean_station_name(filename):
    # Example: Raw_data_1Hr_2024_site_113_Shadipur_Delhi_CPCB_1Hr.csv
    # We want "Shadipur"
    
    # Remove prefix/suffix
    name = filename.replace("Raw_data_1Hr_", "").replace("_1Hr.csv", "")
    # Remove year if present (e.g. 2024_site_...)
    name = re.sub(r'^\d{4}_site_\d+_', '', name)
    # Remove city/agency suffix
    name = name.split("_Delhi")[0]
    
    # Handle special cases mapping to our coordinate keys
    name = name.replace("_", " ")
    if "Dr. Karni Singh" in name: return "Dr. Karni Singh Shooting Range"
    if "North Campus" in name: return "North Campus"
    if "IGI Airport" in name: return "IGI Airport (T3)"
    if "IHBAS" in name: return "IHBAS"
    if "NSIT" in name: return "NSIT Dwarka"
    
    return name

def main():
    all_data = []
    
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: Source directory not found: {SOURCE_DIR}")
        return

    print("Reading files...")
    for filename in os.listdir(SOURCE_DIR):
        if not filename.endswith(".csv"):
            continue
            
        file_path = os.path.join(SOURCE_DIR, filename)
        try:
            df = pd.read_csv(file_path)
            
            # Extract station info
            station_name = clean_station_name(filename)
            lat = 0
            lng = 0
            
            # Find coordinates
            # Try exact match first
            if station_name in STATION_COORDS:
                coords = STATION_COORDS[station_name]
                lat, lng = coords["lat"], coords["lng"]
            else:
                # Fuzzy match or check partials
                for key in STATION_COORDS:
                    if key in station_name or station_name in key:
                        coords = STATION_COORDS[key]
                        lat, lng = coords["lat"], coords["lng"]
                        station_name = key # Standardize name
                        break
            
            if lat == 0:
                print(f"Warning: No coordinates found for {station_name} (File: {filename})")
            
            # Add metadata columns
            df['StationName'] = station_name
            df['Latitude'] = lat
            df['Longitude'] = lng
            
            all_data.append(df)
            
        except Exception as e:
            print(f"Error reading {filename}: {e}")

    if not all_data:
        print("No data loaded.")
        return

    print("Concatenating data...")
    combined_df = pd.concat(all_data, ignore_index=True)
    
    # Rename columns to standard format if needed
    # Check current columns first
    print("Columns found:", combined_df.columns.tolist())
    
    # Mapping based on typical CPCB format observed in previous file view
    col_map = {
        'Timestamp': 'Datetime',
        'PM2.5 (µg/m³)': 'PM2_5_ugm3',
        'PM10 (µg/m³)': 'PM10_ugm3',
        'NO2 (µg/m³)': 'NO2_ugm3',
        'SO2 (µg/m³)': 'SO2_ugm3',
        'CO (mg/m³)': 'CO_ugm3',
        'Ozone (µg/m³)': 'O3_ugm3',
        'AT (°C)': 'Temp_2m_C',
        'RH (%)': 'Humidity_Percent',
        'WS (m/s)': 'Wind_Speed_10m_kmh' # Approx conversion needed if units differ, assuming linear for now or close enough
    }
    
    combined_df.rename(columns=col_map, inplace=True)
    
    # Convert specific columns to numeric, coercing errors
    numeric_cols = ['PM2_5_ugm3', 'PM10_ugm3', 'NO2_ugm3', 'SO2_ugm3', 'CO_ugm3', 'O3_ugm3', 'Temp_2m_C', 'Humidity_Percent', 'Wind_Speed_10m_kmh']
    for col in numeric_cols:
        if col in combined_df.columns:
            combined_df[col] = pd.to_numeric(combined_df[col], errors='coerce')
    
    # Fill or drop NaNs - for now fill simple mean or forward fill?
    # Better to drop rows with no target (PM2.5) for training
    combined_df.dropna(subset=['PM2_5_ugm3'], inplace=True)
    
    # Fill remaining features with 0 or mean
    combined_df.fillna(0, inplace=True)

    # Save
    print(f"Saving combined dataset with {len(combined_df)} rows...")
    combined_df.to_csv(OUTPUT_FILE, index=False)
    print("Done!")

if __name__ == "__main__":
    main()
