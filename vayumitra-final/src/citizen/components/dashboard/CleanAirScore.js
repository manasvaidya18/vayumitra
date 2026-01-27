import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';
import { fetchCitizenScore } from '../../../api/services';

const CleanAirScore = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadScore = async () => {
      try {
        const result = await fetchCitizenScore();
        setData(result);
      } catch (err) {
        console.error("Failed to load clean air score:", err);
      }
    };

    loadScore();
  }, []);

  if (!data) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading clean air score...</p>
        </div>
      </Card>
    );
  }

  if (data.error || !data.insights) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <p className="font-semibold">Unable to load score status</p>
          <p className="text-sm text-slate-400 mt-2">{data.error || "Invalid response from server"}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text flex items-center">
          <Sparkles className="w-6 h-6 mr-2 text-indigo-600" />
          Clean Air Score
        </h2>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${data.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {data.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-semibold">{data.change}% this week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radial Score Display */}
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
            className="relative"
          >
            <svg className="w-56 h-56">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              {/* Background Circle */}
              <circle
                cx="112"
                cy="112"
                r="90"
                stroke="#e2e8f0"
                strokeWidth="16"
                fill="none"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="112"
                cy="112"
                r="90"
                stroke="url(#scoreGradient)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 565' }}
                animate={{ strokeDasharray: `${(data.score / 100) * 565} 565` }}
                transition={{ duration: 2, ease: 'easeOut' }}
                transform="rotate(-90 112 112)"
                className="drop-shadow-glow"
              />
            </svg>

            {/* Center Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold bg-gradient-to-br from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  {data.score}
                </div>
                <div className="text-sm text-slate-600 font-semibold mt-1">out of 100</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Status Badge */}
          <div className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
            <span className="text-green-700 font-semibold text-sm">
              {data.score >= 80 ? 'Excellent' : data.score >= 60 ? 'Good' : data.score >= 40 ? 'Fair' : 'Poor'}
            </span>
          </div>
        </div>

        {/* Trend Chart & Insights */}
        <div className="space-y-6">
          {/* Weekly Trend Chart */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={data.historicalData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Insights */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Key Insights</h3>
            <div className="space-y-2">
              {data.insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.5 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-100"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2" />
                  <p className="text-sm text-slate-700">{insight}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CleanAirScore;