import React from 'react';
import Card from '../common/Card';

const ImpactBreakdown = ({ selectedPolicies }) => {
  // Determine affected sources
  const affected = selectedPolicies.reduce((acc, p) => {
    if (!acc[p.targetSource]) acc[p.targetSource] = 0;
    acc[p.targetSource] += Math.abs(p.impact); // simplified sum for visualization
    return acc;
  }, {});

  const impacts = Object.entries(affected).map(([source, reduction]) => ({
    source,
    reduction: Math.min(reduction, 100), // Cap at 100%
    color: source === 'Vehicular' ? 'bg-blue-500' : source === 'Industrial' ? 'bg-purple-500' : 'bg-orange-500'
  }));

  // Default empty state if no policies
  if (impacts.length === 0) {
    impacts.push({ source: 'No Policies Selected', reduction: 0, color: 'bg-slate-300' });
  }

  const totalReduction = Object.values(affected).reduce((a, b) => a + b, 0);
  const livesSaved = Math.round(totalReduction * 15); // Rough heuristic: 15 lives per % point AQI reduction

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📈 Impact Breakdown</h2>

      <div className="space-y-6">
        {/* By Source */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">By Source (Scenario Forecast):</h3>
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
                  <span className="text-sm font-bold text-green-600 w-12">{impact.reduction > 0 ? '-' : ''}{impact.reduction}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Impact */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Estimated Health Impact:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Avoided Hospitalizations:</span>
              <span className="text-lg font-bold text-green-700">{totalReduction * 50}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Lives saved (Projected):</span>
              <span className="text-lg font-bold text-green-700">{livesSaved}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImpactBreakdown;