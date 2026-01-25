import React from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockHistoricalData } from '../../data/mockData';

const WeeklyTrend = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📅 Weekly Trend Chart</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockHistoricalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center space-x-2">
        <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
          PM2.5
        </button>
        <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
          PM10
        </button>
        <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
          NO2
        </button>
        <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
          All
        </button>
      </div>
    </Card>
  );
};

export default WeeklyTrend;