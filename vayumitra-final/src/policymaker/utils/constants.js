// AQI Status Categories
export const AQI_CATEGORIES = {
  GOOD: { min: 0, max: 50, label: 'Good', color: '#10b981', bgColor: '#d1fae5' },
  MODERATE: { min: 51, max: 100, label: 'Moderate', color: '#f59e0b', bgColor: '#fef3c7' },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, label: 'Unhealthy for Sensitive', color: '#f97316', bgColor: '#fed7aa' },
  UNHEALTHY: { min: 151, max: 200, label: 'Unhealthy', color: '#ef4444', bgColor: '#fecaca' },
  VERY_UNHEALTHY: { min: 201, max: 300, label: 'Very Unhealthy', color: '#dc2626', bgColor: '#fca5a5' },
  HAZARDOUS: { min: 301, max: 500, label: 'Hazardous', color: '#7f1d1d', bgColor: '#991b1b' }
};

// Pollutants
export const POLLUTANTS = {
  PM25: { name: 'PM2.5', unit: 'µg/m³', threshold: 35 },
  PM10: { name: 'PM10', unit: 'µg/m³', threshold: 150 },
  NO2: { name: 'NO2', unit: 'ppb', threshold: 53 },
  O3: { name: 'O3', unit: 'ppb', threshold: 70 },
  SO2: { name: 'SO2', unit: 'ppb', threshold: 75 },
  CO: { name: 'CO', unit: 'ppm', threshold: 9 }
};

// Zones
export const CITY_ZONES = [
  { id: 'A', name: 'Zone A - Central District', population: 250000 },
  { id: 'B', name: 'Zone B - Industrial Area', population: 180000 },
  { id: 'C', name: 'Zone C - Residential North', population: 320000 },
  { id: 'D', name: 'Zone D - Commercial South', population: 150000 },
  { id: 'E', name: 'Zone E - Eastern Suburbs', population: 420000 }
];

// Alert Levels
export const ALERT_LEVELS = {
  LOW: { label: 'Low', color: '#10b981', icon: '🟢' },
  MEDIUM: { label: 'Medium', color: '#f59e0b', icon: '🟡' },
  HIGH: { label: 'High', color: '#f97316', icon: '🟠' },
  SEVERE: { label: 'Severe', color: '#ef4444', icon: '🔴' },
  CRITICAL: { label: 'Critical', color: '#7f1d1d', icon: '⚫' }
};

// Policy Categories with Formula-Based Parameters
// Policy Categories with User-Provided Evidence Data
// City-specific Policy Categories based on Research Data
export const CITY_POLICY_CATEGORIES = {
  Delhi: {
    TRAFFIC: {
      name: 'Traffic & Transport',
      icon: '🚗',
      policies: [
        { id: 'odd-even', name: 'Odd-Even Restrictions', targetSource: 'Vehicular', impact: -6, estimatedCost: 5, implementationTime: 0.1, description: 'Alternate-day car rationing. Reduces peak PM2.5 by ~4-6%.' },
        { id: 'ev-buses', name: 'Electric Bus Fleet (100%)', targetSource: 'Vehicular', impact: -12, estimatedCost: 3800, implementationTime: 24, description: 'Replace diesel/CNG buses with E-buses. Avoids ~44t PM2.5/yr.' },
        { id: 'ev-3wheelers', name: 'Electrify 2/3 Wheelers', targetSource: 'Vehicular', impact: -18, estimatedCost: 1500, implementationTime: 12, description: 'Aggressive EV incentives for autos/scooters (50% of traffic PM).' },
        { id: 'diesel-ban-old', name: 'Ban Old Diesel Vehicles', targetSource: 'Vehicular', impact: -8, estimatedCost: 20, implementationTime: 6, description: 'Phase out diesel trucks/buses >10 years old.' },
        { id: 'congestion-zone', name: 'Low-Emission Zone (Central)', targetSource: 'Vehicular', impact: -5, estimatedCost: 200, implementationTime: 18, description: 'Congestion charging in central Delhi.' }
      ]
    },
    DUST: {
      name: 'Dust & Construction',
      icon: '🏗️',
      policies: [
        { id: 'road-dust-control', name: 'Road Dust Control (Mech. Sweeping)', targetSource: 'Dust', impact: -15, estimatedCost: 150, implementationTime: 1, description: 'Aggressive vacuum sweeping & sprinkling. Cuts coarse PM.' },
        { id: 'construction-controls', name: 'Strict Construction Dust Rules', targetSource: 'Dust', impact: -8, estimatedCost: 50, implementationTime: 0.5, description: 'Mandatory barriers, water sprays at sites.' }
      ]
    },
    SOURCE_SPECIFIC: {
      name: 'Specific Sources',
      icon: '🔥',
      policies: [
        { id: 'firecracker-ban', name: 'Ban on Firecrackers (Seasonal)', targetSource: 'Other', impact: -5, estimatedCost: 2, implementationTime: 0.1, description: 'Strict ban on traditional crackers during Diwali.' },
        { id: 'waste-burning', name: 'Ban on Waste Burning', targetSource: 'Burning', impact: -7, estimatedCost: 15, implementationTime: 3, description: 'Strict enforcement against open garbage burning.' },
        { id: 'stubble-control', name: 'Regional Stubble Control', targetSource: 'Burning', impact: -30, estimatedCost: 500, implementationTime: 6, description: 'Coordinate with states to stop crop residue burning (30% benefit).' }
      ]
    }
  },
  Pune: {
    TRAFFIC: {
      name: 'Traffic & Transport',
      icon: '🚌',
      policies: [
        { id: 'pune-ev-buses', name: 'Electric Bus Fleet (PMPML)', targetSource: 'Vehicular', impact: -9, estimatedCost: 800, implementationTime: 18, description: 'Complete transition to e-buses. Reduces local street pollution.' },
        { id: 'pune-ev-autos', name: 'EV 2/3-Wheelers & Cycling', targetSource: 'Vehicular', impact: -14, estimatedCost: 400, implementationTime: 12, description: 'Scale EV autos and shared bikes. Targets 50% of traffic emissions.' },
        { id: 'nmt-infra', name: 'Non-Motorized Transport (Cycle Lanes)', targetSource: 'Vehicular', impact: -4, estimatedCost: 120, implementationTime: 12, description: 'Expand bike lanes to shift mode share from cars.' }
      ]
    },
    DUST: {
      name: 'Dust & Waste',
      icon: '🧹',
      policies: [
        { id: 'pune-dust-control', name: 'Road & Site Dust Control', targetSource: 'Dust', impact: -12, estimatedCost: 60, implementationTime: 1, description: 'Strict MPCB guidelines for roads and construction sites.' },
        { id: 'waste-mgmt', name: 'Waste Mgmt & No Burning', targetSource: 'Burning', impact: -6, estimatedCost: 80, implementationTime: 6, description: 'Bio-methanation plants and ban on open dumping/burning.' }
      ]
    },
    INDUSTRIAL: {
      name: 'Industrial & Energy',
      icon: '🏭',
      policies: [
        { id: 'pune-industrial-retrofit', name: 'Industrial Emission Retrofits', targetSource: 'Industrial', impact: -8, estimatedCost: 450, implementationTime: 12, description: 'Mandatory scrubbers for Chakan/Bhosari industrial units.' },
        { id: 'pune-brick-kilns', name: 'Brick Kiln Modernization', targetSource: 'Industrial', impact: -5, estimatedCost: 120, implementationTime: 9, description: 'Zig-zag technology mandate for peri-urban kilns.' }
      ]
    }
  }
};

// Default fallback for backward compatibility
export const POLICY_CATEGORIES = CITY_POLICY_CATEGORIES.Delhi;

// Health Conditions
export const HEALTH_CONDITIONS = [
  { id: 'asthma', name: 'Asthma', icon: '🫁' },
  { id: 'copd', name: 'COPD', icon: '🫁' },
  { id: 'bronchitis', name: 'Bronchitis', icon: '🫁' },
  { id: 'cardiovascular', name: 'Cardiovascular', icon: '❤️' },
  { id: 'other', name: 'Other', icon: '🏥' }
];

// Time Periods
export const TIME_PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
];

// Report Types
export const REPORT_TYPES = [
  { value: 'daily-summary', label: 'Daily AQI Summary' },
  { value: 'weekly-trend', label: 'Weekly Trend Analysis' },
  { value: 'monthly-performance', label: 'Monthly Performance Report' },
  { value: 'health-impact', label: 'Health Impact Assessment' },
  { value: 'policy-effectiveness', label: 'Policy Effectiveness Review' },
  { value: 'compliance-audit', label: 'Compliance Audit Report' },
  { value: 'custom', label: 'Custom Report Builder' }
];

// Export Formats
export const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'excel', label: 'Excel', icon: '📊' },
  { value: 'word', label: 'Word', icon: '📝' },
  { value: 'csv', label: 'CSV', icon: '📋' }
];

// Chart Colors
export const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gradient: ['#667eea', '#764ba2', '#f093fb', '#4facfe']
};

// Sensor Status
export const SENSOR_STATUS = {
  ONLINE: { label: 'Online', color: '#10b981', icon: '🟢' },
  OFFLINE: { label: 'Offline', color: '#ef4444', icon: '🔴' },
  MAINTENANCE: { label: 'Maintenance', color: '#f59e0b', icon: '🟡' },
  ERROR: { label: 'Error', color: '#dc2626', icon: '⚠️' }
};