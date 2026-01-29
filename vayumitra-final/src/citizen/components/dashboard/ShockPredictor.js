import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, TrendingUp, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Card from '../common/Card';
import { fetchCitizenShockPredictor, fetchCitizenAQI } from '../../../api/services';

const ShockPredictor = ({ city }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cityName = city?.name || 'Delhi';
        const [shockData, aqiData] = await Promise.all([
          fetchCitizenShockPredictor(cityName),
          fetchCitizenAQI(cityName)
        ]);

        if (shockData && shockData.predictionData) {
          // Sync start point with real CPCB AQI
          const currentAQI = aqiData?.aqi || shockData.predictionData[0].aqi;

          // Create new array with explicit start
          const syncedPredictions = [
            { time: 'Now', aqi: currentAQI },
            ...shockData.predictionData.slice(1) // Keep the rest of the curve
          ];

          setData({
            ...shockData,
            predictionData: syncedPredictions
          });
        }
      } catch (err) {
        console.error("Failed to load shock predictor data:", err);
      }
    };
    loadData();
  }, [city]);

  if (!data) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading predictions...</p>
        </div>
      </Card>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return { bg: 'from-red-50 to-red-100', border: 'border-red-300', text: 'text-red-700', icon: 'text-red-600' };
      case 'moderate': return { bg: 'from-orange-50 to-orange-100', border: 'border-orange-300', text: 'text-orange-700', icon: 'text-orange-600' };
      default: return { bg: 'from-blue-50 to-blue-100', border: 'border-blue-300', text: 'text-blue-700', icon: 'text-blue-600' };
    }
  };

  return (
    <Card>
      <div className="flex items-center mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
        </motion.div>
        <h2 className="text-2xl font-bold gradient-text">AQI Shock Predictor</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts Panel */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Active Alerts
          </h3>
          {data.alerts.map((alert, idx) => {
            const colors = getSeverityColor(alert.severity);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${colors.bg} border ${colors.border} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-5 h-5 ${colors.icon} flex-shrink-0 mt-0.5`} />
                    <div>
                      <h4 className={`font-semibold text-sm ${colors.text}`}>{alert.title}</h4>
                      <p className="text-xs text-slate-600 mt-1">{alert.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.text} bg-white/50`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-2">{alert.message}</p>
              </motion.div>
            );
          })}

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200"
          >
            <div className="flex items-start">
              <Info className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-indigo-900 mb-1">AI Prediction</h4>
                <p className="text-xs text-indigo-700">
                  Using machine learning models to predict pollution spikes based on traffic patterns, weather data, and historical trends.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Prediction Chart */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            12-Hour Forecast
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.predictionData}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                label={{ value: 'AQI', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#aqiGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-slate-400 mr-2" />
              <span className="text-xs text-slate-600">Current</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
              <span className="text-xs text-slate-600">Predicted</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ShockPredictor;