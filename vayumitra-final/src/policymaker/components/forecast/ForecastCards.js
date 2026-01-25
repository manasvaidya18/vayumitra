import React, { useEffect, useState } from 'react';
import { fetchForecast } from '../../../api/services';

const ForecastCards = () => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchForecast();
        setForecastData(data);
      } catch (error) {
        console.error("Error loading forecast cards:", error);
      }
    };
    loadData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      good: 'bg-green-500',
      moderate: 'bg-yellow-500',
      unhealthy: 'bg-orange-500',
      'very-unhealthy': 'bg-red-500',
      hazardous: 'bg-purple-900'
    };
    return colors[status] || 'bg-slate-500';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      good: '🟢',
      moderate: '🟡',
      unhealthy: '🔴',
      'very-unhealthy': '🔴',
      hazardous: '⚫'
    };
    return emojis[status] || '🟡';
  };

  if (!forecastData.length) return <div className="text-center p-4">Loading forecast...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {forecastData.slice(0, 5).map((forecast, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-card p-4 text-center hover:shadow-card-hover transition-shadow"
        >
          <p className="text-sm font-semibold text-slate-600 mb-2">{forecast.day}</p>
          <p className="text-4xl mb-2">{getStatusEmoji(forecast.status)}</p>
          <p className="text-3xl font-bold text-slate-800 mb-1">{forecast.aqi}</p>
          <p className="text-xs text-slate-500 capitalize">{forecast.status.replace('-', ' ')}</p>
        </div>
      ))}
    </div>
  );
};

export default ForecastCards;