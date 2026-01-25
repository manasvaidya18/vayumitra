import React from 'react';
import Card from '../common/Card';

const PollutantBreakdown = () => {
  const pollutants = [
    { name: 'PM2.5', value: 85, max: 100, color: 'bg-red-500' },
    { name: 'PM10', value: 62, max: 100, color: 'bg-orange-500' },
    { name: 'NO2', value: 45, max: 100, color: 'bg-yellow-500' },
    { name: 'O3', value: 38, max: 100, color: 'bg-yellow-500' },
    { name: 'SO2', value: 22, max: 100, color: 'bg-green-500' },
    { name: 'CO', value: 12, max: 100, color: 'bg-green-500' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Pollutant Breakdown</h2>
      <div className="space-y-4">
        {pollutants.map((pollutant) => (
          <div key={pollutant.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-slate-700">{pollutant.name}</span>
              <span className="text-sm font-bold text-slate-800">{pollutant.value}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${pollutant.color} transition-all duration-500`}
                style={{ width: `${pollutant.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PollutantBreakdown;