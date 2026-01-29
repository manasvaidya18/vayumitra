import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sun, Cloud } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Card from '../common/Card';
import { fetchCitizenBestTime, fetchCitizenAQI, fetchMLForecast } from '../../../api/services';

const BestTimeChart = ({ city }) => {
  const [data, setData] = useState(null);
  const [safeHours, setSafeHours] = useState([]);
  const [weatherSummary, setWeatherSummary] = useState("Loading conditions...");

  useEffect(() => {
    const loadData = async () => {
      try {
        const cityName = city?.name || 'Delhi';

        // Fetch real-time AQI and ML Forecast
        const [aqiData, forecastList] = await Promise.all([
          fetchCitizenAQI(cityName),
          fetchMLForecast(cityName)
        ]);

        const now = new Date();
        const currentHour = now.getHours();

        // Generate next 12 hours data
        const next12Hours = [];

        for (let i = 0; i < 12; i++) {
          const time = new Date(now);
          time.setHours(currentHour + i);
          time.setMinutes(0, 0, 0);

          let hour = time.getHours();
          const displayHour = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;

          let aqiVal;
          if (i === 0) {
            // First hour = Current AQI
            aqiVal = aqiData?.aqi || 100;
          } else {
            // Future hours = Find in forecast list (approx match)
            const match = forecastList?.find(f => {
              const fTime = new Date(f.datetime);
              return fTime.getDate() === time.getDate() && fTime.getHours() === hour;
            });
            aqiVal = match ? Math.round(match.predicted_aqi) : (next12Hours[i - 1]?.aqi || 100);
          }

          // Determine Safe/Unsafe (Threshold < 150)
          const isSafe = aqiVal <= 150;

          // Mock Weather
          const weathers = ['Clear', 'Cloudy', 'Partly Cloudy', 'Mist'];
          const weather = weathers[(hour + aqiVal) % weathers.length];

          next12Hours.push({
            hour: displayHour,
            rawHour: hour, // Store 24h int for filtering
            aqi: aqiVal,
            weather: weather,
            safe: isSafe
          });
        }

        setData(next12Hours);

        // Smart Recommendation Logic:
        // 1. Find the 4 hours with minimum AQI
        const top4Lowest = [...next12Hours]
          .sort((a, b) => a.aqi - b.aqi)
          .slice(0, 4);

        // 2. Display them in CHRONOLOGICAL order (as they appear in the graph)
        // by filtering the original sorted time array
        const bestHours = next12Hours.filter(item => top4Lowest.includes(item));

        setSafeHours(bestHours);

        // Generate Dynamic Weather Summary
        const period = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : currentHour < 21 ? 'evening' : 'tonight';
        const avgAQI = Math.round(next12Hours.reduce((acc, curr) => acc + curr.aqi, 0) / next12Hours.length);
        const condition = avgAQI > 200 ? "Use masks outdoors." : avgAQI > 100 ? "Limit prolonged exertion." : "Good time for outdoor activities.";
        setWeatherSummary(`Conditions indicate average AQI of ${avgAQI} for ${period}. ${condition}`);

      } catch (err) {
        console.error("Failed to load best time data:", err);
        setData([]);
      }
    };
    loadData();
  }, [city]);

  // ... (render logic remains, just update the text below)

  // At the bottom of the file (JSX):
  // ...
  //           <div className="flex items-center mb-3">
  //             <Cloud className="w-5 h-5 text-blue-600 mr-2" />
  //             <h3 className="text-sm font-semibold text-blue-900">Weather Conditions</h3>
  //           </div>
  //           <p className="text-sm text-blue-700">
  //             {weatherSummary}
  //           </p>
  // ...

  if (!data) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading time data...</p>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Sun className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-600 font-medium">No more suggestions for today</p>
          <p className="text-slate-400 text-sm">Check back tomorrow morning!</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-white/50">
          <p className="text-sm font-semibold text-slate-800">{data.hour}</p>
          <p className="text-xs text-slate-600 mt-1">AQI: {data.aqi}</p>
          <p className="text-xs text-slate-600">Weather: {data.weather}</p>
          <div className={`text-xs font-semibold mt-1 ${data.safe ? 'text-green-600' : 'text-red-600'}`}>
            {data.safe ? '✓ Safe to go out' : '✗ Stay indoors'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clock className="w-6 h-6 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-bold gradient-text">Best Time to Go Outdoors</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span className="text-xs text-slate-600">Safe</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
            <span className="text-xs text-slate-600">Unsafe</span>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <defs>
              <linearGradient id="safeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="unsafeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="hour"
              stroke="#64748b"
              style={{ fontSize: '11px' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: 'AQI', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Moderate', position: 'right', fill: '#f59e0b', fontSize: 12 }} />
            <Bar
              dataKey="aqi"
              fill="url(#safeGradient)"
              radius={[8, 8, 0, 0]}
              shape={(props) => {
                const { fill, x, y, width, height, payload } = props;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={payload.safe ? 'url(#safeGradient)' : 'url(#unsafeGradient)'}
                    rx={8}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommended Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200"
        >
          <div className="flex items-center mb-3">
            <Sun className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-sm font-semibold text-green-900">Best Hours</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {safeHours.slice(0, 5).map((hour, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
              >
                {hour.hour}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
        >
          <div className="flex items-center mb-3">
            <Cloud className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-sm font-semibold text-blue-900">Weather Conditions</h3>
          </div>
          <p className="text-sm text-blue-700">
            {weatherSummary}
          </p>
        </motion.div>
      </div>
    </Card>
  );
};

export default BestTimeChart;