import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { fetchForecast } from '../../../api/services';

const ForecastChart = ({ city }) => {
  const [forecastData, setForecastData] = useState([]);
  const [metric, setMetric] = useState('aqi'); // 'aqi', 'PM2.5', 'PM10', 'NO2', 'all'

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch city-specific forecast
        const response = await fetch(`/api/ml/forecast-3day?city=${city}`);
        if (response.ok) {
          const rawData = await response.json();
          // rawData: [ { time, predicted_aqi, ... } ]

          const formatted = rawData.map(item => {
            const d = new Date(item.datetime);
            return {
              ...item,
              aqi: item.predicted_aqi, // Map predicted_aqi to aqi for chart
              // Map other pollutants if available, else keep generic or missing
              "PM2.5": item.PM25 || item.pm25 || 0,
              PM10: item.PM10 || item.pm10 || 0,
              NO2: item.NO2 || item.no2 || 0,

              day: d.toLocaleDateString('en-IN', { weekday: 'short', hour: 'numeric', hour12: true }),
              label: `${d.getDate()}th ${d.getHours()}:00`,
              fullDate: d
            };
          });
          setForecastData(formatted);
        }
      } catch (error) {
        console.error("Error loading forecast data:", error);
      }
    };
    loadData();
  }, [city]);

  if (!forecastData.length) return <Card>Loading forecast chart...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📈 3-Day Forecast Chart</h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#64748b" minTickGap={30} />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />

            {(metric === 'aqi' || metric === 'all') && (
              <Area type="monotone" dataKey="aqi" name="AQI" stroke="#6366f1" strokeWidth={3} fillOpacity={metric === 'all' ? 0.1 : 1} fill="url(#colorAqi)" />
            )}

            {(metric === 'PM2.5' || metric === 'all') && (
              <Area type="monotone" dataKey="PM2.5" name="PM2.5" stroke="#ef4444" strokeWidth={metric === 'all' ? 2 : 3} fillOpacity={metric === 'PM2.5' ? 1 : 0.1} fill={metric === 'PM2.5' ? "url(#colorPm25)" : "none"} />
            )}

            {(metric === 'PM10' || metric === 'all') && (
              <Area type="monotone" dataKey="PM10" name="PM10" stroke="#f59e0b" strokeWidth={metric === 'all' ? 2 : 3} fillOpacity={metric === 'PM10' ? 1 : 0} fill="none" />
            )}

            {(metric === 'NO2' || metric === 'all') && (
              <Area type="monotone" dataKey="NO2" name="NO2" stroke="#10b981" strokeWidth={2} fill="none" />
            )}

          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-2 flex-wrap gap-y-2">
        {['aqi', 'PM2.5', 'PM10', 'NO2', 'all'].map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors ${metric === m
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            {m === 'all' ? 'All Pollutants' : m.toUpperCase()}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default ForecastChart;