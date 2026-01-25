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
  if (aqi <= 50) return '🟢';
  if (aqi <= 100) return '🟡';
  if (aqi <= 150) return '🟠';
  if (aqi <= 200) return '🔴';
  return '⚫';
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

// Get color based on value and thresholds
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

// Calculate policy impact
export const calculatePolicyImpact = (selectedPolicies, currentAQI) => {
  const totalImpact = selectedPolicies.reduce((sum, policy) => sum + policy.impact, 0);
  const newAQI = Math.max(0, currentAQI + totalImpact);
  const percentageChange = ((totalImpact / currentAQI) * 100).toFixed(1);
  return {
    newAQI: Math.round(newAQI),
    totalImpact,
    percentageChange
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