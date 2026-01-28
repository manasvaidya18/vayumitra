
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyTrend = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/data/dashboard_stats.json');
        if (res.ok) {
          const data = await res.json();
          setHistoryData(data.weekly_trend);
        }
      } catch (error) {
        console.error("Error loading weekly trend:", error);
      }
    };
    loadData();
  }, []);

  if (!historyData.length) return <Card>Loading weekly trend...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📅 Weekly AQI Trend (Last 7 Days)</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" stroke="#64748b" />
            <YAxis stroke="#64748b" domain={[0, 500]} />
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
              name="AQI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WeeklyTrend;