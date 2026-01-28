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
export const POLICY_CATEGORIES = {
  TRAFFIC: {
    name: 'Traffic & Transport',
    icon: '🚗',
    policies: [
      { id: 'odd-even', name: 'Odd-Even Restriction', targetSource: 'Vehicular', efficiency: 0.15, impact: -8.5, estimatedCost: 50, implementationTime: 0.1 }, // 5-12% (Avg 8.5)
      { id: 'congestion-pricing', name: 'Congestion Pricing', targetSource: 'Vehicular', efficiency: 0.20, impact: -15, estimatedCost: 150, implementationTime: 9 }, // 10-20% (Avg 15)
      { id: 'ev-transport', name: 'EV Public Transport', targetSource: 'Vehicular', efficiency: 0.15, impact: -11.5, estimatedCost: 1200, implementationTime: 36 } // 8-15% (Avg 11.5)
    ]
  },
  INDUSTRIAL: {
    name: 'Industrial & Energy',
    icon: '🏭',
    policies: [
      { id: 'emission-retrofits', name: 'Emission Control Retrofits', targetSource: 'Industrial', efficiency: 0.30, impact: -14, estimatedCost: 500, implementationTime: 24 }, // 8-20% (Avg 14)
      { id: 'brick-kilns', name: 'Brick Kiln Modernization', targetSource: 'Industrial', efficiency: 0.40, impact: -12.5, estimatedCost: 100, implementationTime: 9 }, // 10-15% (Avg 12.5)
      { id: 'relocation', name: 'Industrial Relocation', targetSource: 'Industrial', efficiency: 0.10, impact: -7.5, estimatedCost: 3000, implementationTime: 60 } // 5-10% (Avg 7.5)
    ]
  },
  DUST: {
    name: 'Dust & Urban Surface',
    icon: '🏗️',
    policies: [
      { id: 'dust-control', name: 'Construction Dust Control', targetSource: 'Construction', efficiency: 0.20, impact: -5, estimatedCost: 20, implementationTime: 0.5 }, // 10-20% PM10 -> ~5% AQI
      { id: 'mech-sweeping', name: 'Mechanical Sweeping', targetSource: 'Construction', efficiency: 0.10, impact: -3, estimatedCost: 200, implementationTime: 1 }, // 5-10% PM10 -> ~3% AQI
      { id: 'urban-greening', name: 'Urban Greening (Buffers)', targetSource: 'Other', efficiency: 0.05, impact: -3.5, estimatedCost: 80, implementationTime: 36 } // 2-5% (Avg 3.5)
    ]
  },
  AGRICULTURE: {
    name: 'Agriculture & Regional',
    icon: '🔥',
    policies: [
      { id: 'stubble-control', name: 'Stubble Burning Control', targetSource: 'Burning', efficiency: 0.60, impact: -30, estimatedCost: 400, implementationTime: 6 } // 20-40% (Peak Season Avg 30)
    ]
  }
};

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