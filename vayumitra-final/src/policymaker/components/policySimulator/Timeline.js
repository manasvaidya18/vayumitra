import React from 'react';
import Card from '../common/Card';

const Timeline = () => {
  const phases = [
    {
      phase: 'Phase 1',
      duration: '0-3 months',
      actions: ['Congestion pricing', 'Emission monitoring'],
      color: 'bg-indigo-100 border-indigo-300'
    },
    {
      phase: 'Phase 2',
      duration: '3-6 months',
      actions: ['Clean tech rollout', 'EV infrastructure'],
      color: 'bg-purple-100 border-purple-300'
    },
    {
      phase: 'Phase 3',
      duration: '6-12 months',
      actions: ['Urban forestry', 'Long-term monitoring'],
      color: 'bg-green-100 border-green-300'
    },
  ];

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
          <span className="text-sm font-medium text-slate-700">Total Duration:</span>
          <span className="text-sm font-bold text-indigo-600">12 months</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-full" style={{ width: '0%' }}></div>
        </div>
      </div>
    </Card>
  );
};

export default Timeline;