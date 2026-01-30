import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchWeatherData } from '../../../api/services';

const WeatherCorrelation = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`/api/policymaker/weather?city=${city}`);
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        }
      } catch (error) {
        console.error("Error loading weather data:", error);
      }
    };
    loadData();
  }, [city]);

  const getTrendArrow = (trend) => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getImpactColor = (impact) => {
    if (impact === 'worsens') return 'text-red-600';
    if (impact === 'improves') return 'text-green-600';
    return 'text-slate-600';
  };

  if (!weatherData) return <Card>Loading weather correlation...</Card>;

  const weatherParams = [
    { label: 'Temp', value: `${weatherData.temperature}°C`, trend: weatherData.trends.temperature, impact: weatherData.impacts.temperature, icon: '🌡️' },
    { label: 'Humidity', value: `${weatherData.humidity}%`, trend: weatherData.trends.humidity, impact: weatherData.impacts.humidity, icon: '💧' },
    { label: 'Wind', value: `${weatherData.windSpeed} km/h`, trend: weatherData.trends.windSpeed, impact: weatherData.impacts.windSpeed, icon: '💨' },
    { label: 'Pressure', value: `${weatherData.pressure} hPa`, trend: weatherData.trends.pressure, impact: weatherData.impacts.pressure, icon: '🌊' },
    { label: 'Rain', value: `${weatherData.rainProbability}%`, trend: weatherData.trends.rain, impact: weatherData.impacts.rain, icon: '🌧️' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🌤️ Weather Correlation</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {weatherParams.map((param) => (
          <div key={param.label} className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-4 text-center border border-slate-200">
            <p className="text-2xl mb-2">{param.icon}</p>
            <p className="text-xs text-slate-600 mb-1">{param.label}</p>
            <p className="text-lg font-bold text-slate-800 mb-1">{param.value}</p>
            <p className="text-sm text-slate-600 mb-1">{getTrendArrow(param.trend)}</p>
            <p className={`text-xs font-semibold capitalize ${getImpactColor(param.impact)}`}>
              {param.impact}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Forecast Confidence:</span>
          <span className="text-sm font-bold text-indigo-600">{weatherData.confidence || 85}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mt-2 overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${weatherData.confidence || 85}%` }}></div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCorrelation;