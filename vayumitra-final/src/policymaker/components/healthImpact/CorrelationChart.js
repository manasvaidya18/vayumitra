import React from 'react';
import Card from '../common/Card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CorrelationChart = () => {
  const data = [
    { aqi: 50, cases: 120 },
    { aqi: 75, cases: 180 },
    { aqi: 100, cases: 280 },
    { aqi: 125, cases: 420 },
    { aqi: 150, cases: 580 },
    { aqi: 175, cases: 780 },
    { aqi: 200, cases: 1050 },
    { aqi: 225, cases: 1380 },
    { aqi: 250, cases: 1720 },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        📊 AQI vs Health Outcomes Correlation
      </h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              dataKey="aqi"
              name="AQI"
              stroke="#64748b"
              label={{ value: 'AQI Level', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="number"
              dataKey="cases"
              name="Cases"
              stroke="#64748b"
              label={{ value: 'Hospital Visits', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Scatter
              name="Health Impact"
              data={data}
              fill="#6366f1"
              fillOpacity={0.6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600">
          Correlation Coefficient: <span className="font-bold text-indigo-600">0.89</span>
          {' '}(Strong Positive)
        </p>
      </div>
    </Card>
  );
};

export default CorrelationChart;