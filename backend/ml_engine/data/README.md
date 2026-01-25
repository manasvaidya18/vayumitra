# Delhi AQI Model Data

This folder contains the clean dataset used for training the AQI prediction model.

## 📄 File: `delhi_model_data.csv`

### Overview
- **Rows**: 26,543 hourly records
- **Columns**: 11 columns
- **Date Range**: August 5, 2022 to November 26, 2025
- **File Size**: 1.77 MB
- **City**: Delhi, India

### Columns Description

| # | Column Name | Description | Unit |
|---|-------------|-------------|------|
| 1 | `Datetime` | Timestamp (hourly) | YYYY-MM-DD HH:MM:SS |
| 2 | `PM2_5_ugm3` | PM2.5 concentration | μg/m³ |
| 3 | `PM10_ugm3` | PM10 concentration | μg/m³ |
| 4 | `NO2_ugm3` | Nitrogen Dioxide concentration | μg/m³ |
| 5 | `CO_ugm3` | Carbon Monoxide concentration | μg/m³ |
| 6 | `O3_ugm3` | Ozone concentration | μg/m³ |
| 7 | `SO2_ugm3` | Sulfur Dioxide concentration | μg/m³ |
| 8 | `Temp_2m_C` | Temperature at 2m height | °C |
| 9 | `Humidity_Percent` | Relative humidity | % |
| 10 | `Wind_Speed_10m_kmh` | Wind speed at 10m height | km/h |
| 11 | `AQI` | Air Quality Index (CPCB method) | 0-500 |

### Data Quality
✅ **No missing values** - All rows are complete  
✅ **Cleaned data** - Outliers removed using IQR method  
✅ **Hourly frequency** - Consistent time intervals  
✅ **CPCB-compliant AQI** - Calculated using official methodology  

### Usage

#### Load the data in Python:
```python
import pandas as pd

# Load the dataset
df = pd.read_csv('backend/data/delhi_model_data.csv')

# Convert datetime to proper format
df['Datetime'] = pd.to_datetime(df['Datetime'])

# Set datetime as index for time-series analysis
df.set_index('Datetime', inplace=True)

print(f"Loaded {len(df):,} records")
print(f"Date range: {df.index.min()} to {df.index.max()}")
```

#### Quick statistics:
```python
# Summary statistics
print(df.describe())

# Check for missing values
print(df.isnull().sum())

# AQI distribution
print(df['AQI'].value_counts(bins=6, sort=False))
```

### Model Features
The model uses **9 input features** to predict AQI:

**Pollutants (6)**:
- PM2.5, PM10, NO2, CO, O3, SO2

**Meteorological (3)**:
- Temperature, Humidity, Wind Speed

**Target Variable**:
- AQI (Air Quality Index)

### AQI Categories

| AQI Range | Category | Color |
|-----------|----------|-------|
| 0-50 | Good | 🟢 Green |
| 51-100 | Satisfactory | 🟡 Yellow |
| 101-200 | Moderate | 🟠 Orange |
| 201-300 | Poor | 🔴 Red |
| 301-400 | Very Poor | 🟣 Purple |
| 401-500 | Severe | 🟤 Maroon |

### Data Source
- **Original Source**: Central Pollution Control Board (CPCB)
- **Processing**: Cleaned and filtered from full CPCB dataset
- **Methodology**: CPCB AQI calculation standards

### Notes for Team
- This is the **exact dataset** used to train the CNN+LSTM model
- Contains only the parameters needed for the model (no extra columns)
- Ready to use for:
  - Model retraining
  - Data analysis
  - Visualization
  - Sharing with stakeholders
- File is small enough to share via email/GitHub (1.77 MB)

### How This File Was Created
Generated using `create_clean_data.py` script which:
1. Loaded full Delhi dataset from `aqi_prediction/data/processed/`
2. Selected only the 11 required columns
3. Removed rows with missing values
4. Saved to clean CSV format

---

**Last Updated**: January 25, 2026  
**Contact**: See main project README for questions
