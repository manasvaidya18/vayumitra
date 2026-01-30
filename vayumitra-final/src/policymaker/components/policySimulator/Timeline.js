import React from 'react';
import Card from '../common/Card';

const Timeline = ({ selectedPolicies }) => {
  // Group policies into phases
  const phases = [
    {
      phase: 'Phase 1: Immediate',
      duration: '0-3 months',
      actions: selectedPolicies.filter(p => p.implementationTime <= 3).map(p => p.name),
      color: 'bg-green-50 border-green-200'
    },
    {
      phase: 'Phase 2: Short Term',
      duration: '3-12 months',
      actions: selectedPolicies.filter(p => p.implementationTime > 3 && p.implementationTime <= 12).map(p => p.name),
      color: 'bg-indigo-50 border-indigo-200'
    },
    {
      phase: 'Phase 3: Long Term',
      duration: '12+ months',
      actions: selectedPolicies.filter(p => p.implementationTime > 12).map(p => p.name),
      color: 'bg-purple-50 border-purple-200'
    },
  ].filter(phase => phase.actions.length > 0);

  if (phases.length === 0) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-slate-800 mb-4">🗓️ Implementation Timeline</h2>
        <p className="text-slate-500 text-center py-8">Select policies to generate a timeline.</p>
      </Card>
    );
  }

  const maxDuration = Math.max(...selectedPolicies.map(p => p.implementationTime || 0));

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🗓️ Implementation Timeline</h2>

      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={index} className={`p-4 rounded-lg border-2 ${phase.color}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800">{phase.phase}</h3>
              <span className="text-sm font-medium text-slate-600">({phase.duration})</span>
            </div>
            <ul className="space-y-1">
              {phase.actions.map((action, i) => (
                <li key={i} className="text-sm text-slate-700">• {action}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Total Project Duration:</span>
          <span className="text-sm font-bold text-indigo-600">{maxDuration} months</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-full" style={{ width: '100%' }}></div>
        </div>
      </div>
    </Card>
  );
};

export default Timeline;