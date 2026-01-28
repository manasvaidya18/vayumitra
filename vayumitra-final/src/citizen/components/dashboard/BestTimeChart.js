import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sun, Cloud } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Card from '../common/Card';
import { fetchCitizenBestTime } from '../../../api/services';

const BestTimeChart = ({ city }) => {
  const [data, setData] = useState([]);
  const [safeHours, setSafeHours] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cityName = city?.name || 'Delhi';
        const result = await fetchCitizenBestTime(cityName);
        if (result && Array.isArray(result)) {
          setData(result);
          // Use 'recommended' if available, otherwise fallback to 'safe'
          const recommended = result.filter(d => d.recommended !== undefined ? d.recommended : d.safe);
          setSafeHours(recommended);
        }
      } catch (err) {
        console.error("Failed to load best time data:", err);
      }
    };
    loadData();
  }, [city]);

  if (data.length === 0) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading time data...</p>
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
            Clear skies expected in the afternoon. Wind speed: 12 km/h. UV Index: Moderate
          </p>
        </motion.div>
      </div>
    </Card>
  );
};

export default BestTimeChart;