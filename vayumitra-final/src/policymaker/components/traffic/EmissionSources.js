import React from 'react';
import Card from '../common/Card';

const EmissionSources = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🏭 Emission Sources</h2>
      <div className="h-64 flex flex-col items-center justify-center text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg">
        <span className="text-4xl mb-2">🚧</span>
        <h3 className="text-lg font-bold text-slate-700">Detailed Source Apportionment Coming Soon</h3>
        <p className="text-sm text-slate-500 max-w-xs mt-1">
          We are calibrating city-specific emission inventories for accurate breakdown.
        </p>
      </div>
    </Card>
  );
};

export default EmissionSources;