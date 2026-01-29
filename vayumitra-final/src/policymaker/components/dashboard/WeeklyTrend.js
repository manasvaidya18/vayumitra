
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyTrend = ({ city = 'Delhi' }) => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/ml/history?city=${city}&days=7`);
        if (res.ok) {
          const rawData = await res.json();

          if (Array.isArray(rawData)) {
            // Aggregate hourly data into daily averages
            const dailyMap = {};

            rawData.forEach(point => {
              // Date string YYYY-MM-DD
              const dateStr = point.datetime.split('T')[0];
              if (!dailyMap[dateStr]) dailyMap[dateStr] = { sum: 0, count: 0, date: dateStr };
              dailyMap[dateStr].sum += point.aqi;
              dailyMap[dateStr].count += 1;
            });

            // Convert to array and format
            const aggregated = Object.values(dailyMap)
              .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort chronologically
              .map(d => {
                const dateObj = new Date(d.date);
                return {
                  day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }), // 'Mon', 'Tue'
                  aqi: Math.round(d.sum / d.count),
                  fullDate: d.date
                };
              });

            // Ensure we take the last 7 days
            setHistoryData(aggregated.slice(-7));
          }
        }
      } catch (error) {
        console.error("Error loading weekly trend:", error);
      }
    };
    loadData();
  }, [city]);

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