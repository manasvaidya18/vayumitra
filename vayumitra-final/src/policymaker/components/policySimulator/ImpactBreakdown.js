import React from 'react';
import Card from '../common/Card';

const ImpactBreakdown = () => {
  const impacts = [
    { source: 'Vehicular', reduction: 35, color: 'bg-blue-500' },
    { source: 'Industrial', reduction: 42, color: 'bg-purple-500' },
    { source: 'Construction', reduction: 15, color: 'bg-orange-500' },
  ];

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📈 Impact Breakdown</h2>
      
      <div className="space-y-6">
        {/* By Source */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">By Source:</h3>
          <div className="space-y-3">
            {impacts.map((impact) => (
              <div key={impact.source} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">• {impact.source}:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-full ${impact.color} rounded-full`}
                      style={{ width: `${impact.reduction}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-green-600 w-12">-{impact.reduction}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Impact */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Health Impact:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Fewer cases annually:</span>
              <span className="text-lg font-bold text-green-700">15,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Lives saved per year:</span>
              <span className="text-lg font-bold text-green-700">450</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImpactBreakdown;