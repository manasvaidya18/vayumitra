export const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: '#22c55e', bgColor: 'bg-success-500' };
  if (aqi <= 100) return { level: 'Moderate', color: '#f59e0b', bgColor: 'bg-warning-500' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#f97316', bgColor: 'bg-orange-500' };
  if (aqi <= 200) return { level: 'Unhealthy', color: '#ef4444', bgColor: 'bg-danger-500' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#dc2626', bgColor: 'bg-red-700' };
  return { level: 'Hazardous', color: '#991b1b', bgColor: 'bg-red-900' };
};

export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getGradientForAQI = (aqi) => {
  if (aqi <= 50) return 'from-green-400 to-emerald-500';
  if (aqi <= 100) return 'from-yellow-400 to-orange-400';
  if (aqi <= 150) return 'from-orange-400 to-red-400';
  if (aqi <= 200) return 'from-red-500 to-red-700';
  if (aqi <= 300) return 'from-red-700 to-purple-700';
  return 'from-purple-800 to-gray-900';
};

export const calculatePercentage = (value, max) => {
  return Math.min((value / max) * 100, 100);
};