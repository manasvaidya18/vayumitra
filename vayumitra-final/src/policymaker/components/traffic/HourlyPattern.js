import React from 'react';
import Card from '../common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockHourlyTraffic } from '../../data/mockData';

const HourlyPattern = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📈 Hourly Traffic Pattern</h2>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockHourlyTraffic}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="hour" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-xs text-slate-600">Peak Morning</p>
          <p className="text-lg font-bold text-red-600">8-10 AM</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <p className="text-xs text-slate-600">Peak Evening</p>
          <p className="text-lg font-bold text-orange-600">5-7 PM</p>
        </div>
      </div>
    </Card>
  );
};

export default HourlyPattern;