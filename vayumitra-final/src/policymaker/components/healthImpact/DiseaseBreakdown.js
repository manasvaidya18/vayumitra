import React from 'react';
import Card from '../common/Card';

const DiseaseBreakdown = () => {
  const diseases = [
    { name: 'Asthma', percentage: 35, cases: 15830, color: 'bg-red-500' },
    { name: 'COPD', percentage: 22, cases: 9950, color: 'bg-orange-500' },
    { name: 'Bronchitis', percentage: 18, cases: 8140, color: 'bg-yellow-500' },
    { name: 'Cardiovascular', percentage: 15, cases: 6780, color: 'bg-blue-500' },
    { name: 'Other', percentage: 10, cases: 4520, color: 'bg-slate-500' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Disease Burden Breakdown</h2>
      
      <div className="space-y-4">
        {diseases.map((disease) => (
          <div key={disease.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">{disease.name}</span>
              <span className="text-sm text-slate-600">
                {disease.percentage}% ({disease.cases.toLocaleString()} cases)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${disease.color} transition-all duration-500`}
                style={{ width: `${disease.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DiseaseBreakdown;