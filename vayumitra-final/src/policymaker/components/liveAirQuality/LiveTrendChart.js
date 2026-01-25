import React from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockHistoricalData } from '../../data/mockData';

const LiveTrendChart = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📈 Live Trend (Last 24 Hours)</h2>
      
      <div className="mb-4">
        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
          <option>PM2.5</option>
          <option>PM10</option>
          <option>NO2</option>
          <option>O3</option>
          <option>All Pollutants</option>
        </select>
      </div>

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
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="pm25"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
          Hourly
        </button>
        <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
          Daily
        </button>
        <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
          Weekly
        </button>
      </div>
    </Card>
  );
};

export default LiveTrendChart;