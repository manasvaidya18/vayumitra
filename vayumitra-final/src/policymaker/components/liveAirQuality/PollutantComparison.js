import React from 'react';
import Card from '../common/Card';

const PollutantComparison = () => {
  const pollutants = [
    { name: 'PM2.5', value: 85, status: '🔴' },
    { name: 'PM10', value: 62, status: '🟠' },
    { name: 'NO2', value: 45, status: '🟡' },
    { name: 'O3', value: 38, status: '🟡' },
    { name: 'SO2', value: 22, status: '🟢' },
    { name: 'CO', value: 12, status: '🟢' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        📊 Pollutant Comparison (All Sensors Average)
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {pollutants.map((pollutant) => (
          <div
            key={pollutant.name}
            className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-4 text-center border border-slate-200"
          >
            <p className="text-sm font-semibold text-slate-700 mb-2">{pollutant.name}</p>
            <p className="text-3xl font-bold text-slate-800 mb-2">{pollutant.value}</p>
            <p className="text-2xl">{pollutant.status}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PollutantComparison;