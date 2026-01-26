"""
AQI Calculator Module
Implements CPCB (Central Pollution Control Board) methodology for AQI calculation.
"""

import pandas as pd
import numpy as np
from .aqi_config import AQI_BREAKPOINTS, AQI_CATEGORIES


def calculate_sub_index(pollutant, concentration):
    """
    Calculate sub-index for a specific pollutant using CPCB breakpoints.
    
    Parameters:
    -----------
    pollutant : str
        Pollutant name (e.g., 'PM2_5_ugm3')
    concentration : float
        Pollutant concentration
    
    Returns:
    --------
    float
        Sub-index value (0-500)
    """
    if pd.isna(concentration) or concentration < 0:
        return np.nan
    
    if pollutant not in AQI_BREAKPOINTS:
        return np.nan
    
    breakpoints = AQI_BREAKPOINTS[pollutant]
    
    # Find the appropriate breakpoint range
    for bp_low, bp_high, aqi_low, aqi_high in breakpoints:
        if bp_low <= concentration <= bp_high:
            # Linear interpolation formula
            sub_index = ((aqi_high - aqi_low) / (bp_high - bp_low)) * (concentration - bp_low) + aqi_low
            return round(sub_index, 2)
    
    # If concentration exceeds all breakpoints, cap at 500
    if concentration > breakpoints[-1][1]:
        return 500.0
    
    return np.nan


def calculate_aqi(row):
    """
    Calculate final AQI as the maximum of all pollutant sub-indices.
    
    Parameters:
    -----------
    row : pd.Series
        Row containing pollutant concentrations
    
    Returns:
    --------
    float
        Final AQI value (0-500)
    """
    sub_indices = []
    
    # Calculate sub-index for each pollutant
    for pollutant in AQI_BREAKPOINTS.keys():
        if pollutant in row.index and pd.notna(row[pollutant]):
            sub_idx = calculate_sub_index(pollutant, row[pollutant])
            if pd.notna(sub_idx):
                sub_indices.append(sub_idx)
    
    # Final AQI is the maximum sub-index
    if len(sub_indices) > 0:
        return max(sub_indices)
    else:
        return np.nan


def get_aqi_category(aqi):
    """
    Get AQI category and color based on AQI value.
    
    Parameters:
    -----------
    aqi : float
        AQI value
    
    Returns:
    --------
    tuple
        (category_name, color_code)
    """
    if pd.isna(aqi):
        return ('Unknown', '#CCCCCC')
    
    for min_aqi, max_aqi, category, color in AQI_CATEGORIES:
        if min_aqi <= aqi <= max_aqi:
            return (category, color)
    
    # If AQI exceeds 500 (shouldn't happen, but just in case)
    return ('Severe', '#7E0023')


def compute_aqi_for_dataframe(df, inplace=False):
    """
    Compute AQI for entire dataframe.
    
    Parameters:
    -----------
    df : pd.DataFrame
        Dataframe with pollutant concentrations
    inplace : bool
        If True, modify dataframe in place
    
    Returns:
    --------
    pd.DataFrame
        Dataframe with computed AQI columns
    """
    if not inplace:
        df = df.copy()
    
    print("Computing CPCB-compliant AQI...")
    
    # Calculate AQI for each row
    
    # If AQI_computed already exists (e.g. from CPCB API), compute only for missing
    if 'AQI_computed' not in df.columns:
        df['AQI_computed'] = np.nan
        
    # Calculate AQI only where it's missing or 0
    mask_missing = (df['AQI_computed'].isna()) | (df['AQI_computed'] == 0)
    
    if mask_missing.any():
        # Only apply calculation on missing rows
        computed_vals = df.loc[mask_missing].apply(calculate_aqi, axis=1)
        df.loc[mask_missing, 'AQI_computed'] = computed_vals
    
    # Fill remaining NaNs with 0 if any
    df['AQI_computed'] = df['AQI_computed'].fillna(0)
    
    # Get category and color
    aqi_info = df['AQI_computed'].apply(get_aqi_category)
    df['AQI_category'] = aqi_info.apply(lambda x: x[0])
    df['AQI_color'] = aqi_info.apply(lambda x: x[1])
    
    # Statistics
    valid_aqi = df['AQI_computed'].notna().sum()
    total = len(df)
    print(f"✓ Computed AQI for {valid_aqi:,} / {total:,} rows ({valid_aqi/total*100:.1f}%)")
    
    if valid_aqi > 0:
        # Check if min/max/mean calls raise errors on empty sets or NaN
        if df['AQI_computed'].count() > 0:
            print(f"  AQI range: {df['AQI_computed'].min():.1f} - {df['AQI_computed'].max():.1f}")
            print(f"  Mean AQI: {df['AQI_computed'].mean():.1f}")
            print(f"  Median AQI: {df['AQI_computed'].median():.1f}")
        
        # Category distribution
        print("\n  Category distribution:")
        category_counts = df['AQI_category'].value_counts()
        for category, count in category_counts.items():
            pct = (count / valid_aqi) * 100
            print(f"    {category:15s}: {count:6,} ({pct:5.1f}%)")
    
    return df
