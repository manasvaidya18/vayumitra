
import React, { useEffect, useState } from 'react';

const ForecastCards = () => {
  const [forecastDays, setForecastDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/city_forecast_72h.json');
        if (response.ok) {
          const data = await response.json();

          // Data is [ { time: "ISO", aqi: int }, ... ]
          // We need to group by Day
          const dailyMap = {};

          data.forEach(point => {
            const d = new Date(point.time);
            const dateKey = d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });

            if (!dailyMap[dateKey]) {
              dailyMap[dateKey] = { sum: 0, count: 0, date: d };
            }
            dailyMap[dateKey].sum += point.aqi;
            dailyMap[dateKey].count += 1;
          });

          const days = Object.keys(dailyMap).slice(0, 3).map((key, index) => {
            const item = dailyMap[key];
            const avgAQI = Math.round(item.sum / item.count);

            // Determine Status
            let status = 'Good';
            let color = 'bg-green-500';
            if (avgAQI > 50) { status = 'Satisfactory'; color = 'bg-green-400'; }
            if (avgAQI > 100) { status = 'Moderate'; color = 'bg-yellow-400'; }
            if (avgAQI > 200) { status = 'Poor'; color = 'bg-orange-500'; }
            if (avgAQI > 300) { status = 'Very Poor'; color = 'bg-red-500'; }
            if (avgAQI > 400) { status = 'Severe'; color = 'bg-red-800'; }

            const label = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'Day 3';

            return {
              day: label + ` (${item.date.getDate()} ${item.date.toLocaleString('default', { month: 'short' })})`,
              aqi: avgAQI,
              status,
              color
            };
          });

          setForecastDays(days);
        }
      } catch (error) {
        console.error("Error loading forecast cards:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {forecastDays.map((forecast, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-card p-6 text-center hover:shadow-card-hover transition-all border border-slate-100 hover:border-slate-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-center mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${forecast.color}`}>
              {forecast.status}
            </span>
          </div>
          <p className="text-5xl font-bold text-slate-800 mb-2">{forecast.aqi}</p>
          <p className="text-sm font-semibold text-slate-500">{forecast.day}</p>
          <div className="mt-4 text-xs text-slate-400">Average Daily AQI</div>
        </div>
      ))}
    </div>
  );
};

export default ForecastCards;