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

// Policy Categories
export const POLICY_CATEGORIES = {
  TRAFFIC: {
    name: 'Traffic Measures',
    icon: '🚗',
    policies: [
      { id: 'odd-even', name: 'Odd-Even Rule', impact: -15 },
      { id: 'congestion-pricing', name: 'Congestion Pricing', impact: -12 },
      { id: 'diesel-ban', name: 'Diesel Ban', impact: -25 },
      { id: 'ev-incentives', name: 'EV Incentives', impact: -8 }
    ]
  },
  INDUSTRIAL: {
    name: 'Industrial Measures',
    icon: '🏭',
    policies: [
      { id: 'emission-caps', name: 'Emission Caps', impact: -20 },
      { id: 'factory-relocation', name: 'Factory Relocation', impact: -35 },
      { id: 'clean-tech', name: 'Clean Tech Mandate', impact: -15 }
    ]
  },
  GREEN: {
    name: 'Green Measures',
    icon: '🌳',
    policies: [
      { id: 'urban-forestry', name: 'Urban Forestry', impact: -5 },
      { id: 'green-corridors', name: 'Green Corridors', impact: -10 }
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