import { AQI_CATEGORIES } from './constants';

// Get AQI Category based on value
export const getAQICategory = (aqi) => {
  if (aqi <= 50) return AQI_CATEGORIES.GOOD;
  if (aqi <= 100) return AQI_CATEGORIES.MODERATE;
  if (aqi <= 150) return AQI_CATEGORIES.UNHEALTHY_SENSITIVE;
  if (aqi <= 200) return AQI_CATEGORIES.UNHEALTHY;
  if (aqi <= 300) return AQI_CATEGORIES.VERY_UNHEALTHY;
  return AQI_CATEGORIES.HAZARDOUS;
};

// Get AQI Status Emoji
export const getAQIEmoji = (aqi) => {
  if (aqi <= 50) return '🟢'; // Good
  if (aqi <= 100) return '🟢'; // Satisfactory (User might want yellow here strictly speaking but adhering to simple traffic light for now, or stick to standard)
  if (aqi <= 200) return '🟡'; // Moderate
  if (aqi <= 300) return '🟠'; // Poor
  if (aqi <= 400) return '🔴'; // Very Poor
  return '🟤'; // Severe/Hazardous (Brown/Dark Red instead of black)
};

export const getAQIColor = (aqi) => {
  if (aqi <= 50) return 'text-green-500';
  if (aqi <= 100) return 'text-lime-500';
  if (aqi <= 200) return 'text-yellow-500';
  if (aqi <= 300) return 'text-orange-500';
  if (aqi <= 400) return 'text-red-500';
  return 'text-red-900';
};

// Format number with commas
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Format currency (Indian Rupees)
export const formatCurrency = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`;
  }
  return `₹${amount}`;
};

// Format date
export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-IN', options);
};

// Format time
export const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString('en-IN', options);
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Get trend direction
export const getTrendDirection = (current, previous) => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'neutral';
};

// Generate random AQI value (for demo)
export const generateRandomAQI = (min = 50, max = 300) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Calculate health risk score
export const calculateHealthRisk = (aqi, population, vulnerablePercent = 0.3) => {
  const vulnerablePopulation = population * vulnerablePercent;
  const riskMultiplier = aqi > 200 ? 3 : aqi > 150 ? 2 : aqi > 100 ? 1.5 : 1;
  return Math.floor(vulnerablePopulation * riskMultiplier * 0.01);
};

// Download file helper
export const downloadCSV = (data, filename) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(','));
  const csvContent = [headers, ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getColorByThreshold = (value, thresholds) => {
  if (value < thresholds.low) return '#10b981';
  if (value < thresholds.medium) return '#f59e0b';
  if (value < thresholds.high) return '#f97316';
  return '#ef4444';
};

// Download file helper
export const downloadFile = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Generate chart data
export const generateChartData = (days, baseValue = 100) => {
  return Array.from({ length: days }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: baseValue + Math.random() * 100 - 50
  }));
};

// Calculate policy impact using Standard Formula
// Impact = Sum(SourceContribution * PolicyEfficiency)
export const calculatePolicyImpact = (selectedPolicies, currentAQI, sourceBreakdown = null) => {
  // Default Breakdown (if live data unavailable) - based on Delhi Winter average
  const defaultBreakdown = {
    'Vehicular': 0.41,
    'Industrial': 0.18,
    'Construction': 0.08,
    'Burning': 0.05,
    'Other': 0.28
  };

  // Extract percentages from sourceBreakdown if provided
  // sourceBreakdown structure expected: [{source: 'Vehicular', percentage: 40}, ...]
  let sourceMap = { ...defaultBreakdown };

  if (sourceBreakdown && Array.isArray(sourceBreakdown)) {
    // Normalize to 0-1 range
    sourceBreakdown.forEach(s => {
      sourceMap[s.source] = s.percentage / 100;
    });
  }


  // We need to apply max efficiency per source if multiple policies target same source?
  // Or cumulative? e.g. Odd-Even (45%) + Diesel Ban (25%) -> 1 - (0.55 * 0.75) = 58% reduction
  // Standard formula: Cumulative impact on the source.

  // UPDATED LOGIC: Use explicit Global Impact percentages from policy definition
  // This aligns with user-provided "Evidence" data (e.g. "5-12% AQI reduction")
  // We use a diminishing returns formula: 1 - (1-p1)*(1-p2)... to avoid >100% reduction

  const impacts = selectedPolicies.map(p => Math.abs(p.impact) / 100);

  // Calculate remaining factor (what's left of the pollution)
  // e.g. Impact 10% -> 0.9 remaining.
  let remainingFactor = impacts.reduce((acc, imp) => acc * (1 - imp), 1.0);

  // Total reduction is 1 - remaining
  let totalReductionFactor = 1 - remainingFactor;

  /* 
  // OLD SOURCE-BASED LOGIC (Commented out for now as user provided global impacts)
  // Group policies by target source
  const sourcePolicies = {};
  selectedPolicies.forEach(p => {
    if (!sourcePolicies[p.targetSource]) sourcePolicies[p.targetSource] = [];
    sourcePolicies[p.targetSource].push(p.efficiency);
  });

  Object.keys(sourcePolicies).forEach(source => {
    if (sourceMap[source]) {
      const efficiencies = sourcePolicies[source];
      const rem = efficiencies.reduce((acc, eff) => acc * (1 - eff), 1);
      const red = 1 - rem;
      totalReductionFactor += (sourceMap[source] * red);
    }
  });
  */

  const reductionAmount = Math.round(currentAQI * totalReductionFactor);
  const newAQI = Math.max(0, currentAQI - reductionAmount);
  const percentageChange = ((reductionAmount / currentAQI) * 100).toFixed(1);

  return {
    newAQI,
    totalImpact: -reductionAmount, // Negative to indicate reduction
    percentageChange: percentageChange
  };
};

// Validate date range
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  if (start > end) return { valid: false, message: 'Start date must be before end date' };
  if (end > now) return { valid: false, message: 'End date cannot be in the future' };

  return { valid: true, message: '' };
};

// Get time of day
export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
};

// Sort array by key
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, keys) => {
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    keys.some(key =>
      String(item[key]).toLowerCase().includes(term)
    )
  );
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Calculate average
export const calculateAverage = (array, key) => {
  if (array.length === 0) return 0;
  const sum = array.reduce((acc, item) => acc + (item[key] || 0), 0);
  return Math.round(sum / array.length);
};

// Get status badge classes
export const getStatusBadgeClass = (status) => {
  const classes = {
    good: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    unhealthy: 'bg-orange-100 text-orange-800',
    'very-unhealthy': 'bg-red-100 text-red-800',
    hazardous: 'bg-purple-100 text-purple-800',
    online: 'bg-green-100 text-green-800',
    offline: 'bg-red-100 text-red-800',
    maintenance: 'bg-yellow-100 text-yellow-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};