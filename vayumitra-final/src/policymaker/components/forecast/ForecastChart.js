import React from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { mockForecastData } from '../../data/mockData';

const ForecastChart = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📈 7-Day Forecast Chart</h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockForecastData}>
            <defs>
              <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAqi)"
            />
          </AreaChart>
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
          All Pollutants
        </button>
      </div>
    </Card>
  );
};

export default ForecastChart;