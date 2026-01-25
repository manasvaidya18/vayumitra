import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { mockZoneHealthImpact } from '../../data/mockData';

const ZoneWiseImpact = () => {
  const getRiskColor = (risk) => {
    const colors = {
      SEVERE: 'bg-red-100 text-red-700',
      HIGH: 'bg-orange-100 text-orange-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-green-100 text-green-700'
    };
    return colors[risk] || colors.MEDIUM;
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🗺️ Zone-Wise Impact</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Zone</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Population</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Cases</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Risk</th>
            </tr>
          </thead>
          <tbody>
            {mockZoneHealthImpact.map((zone) => (
              <tr key={zone.zone} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 text-sm font-bold text-slate-800">{zone.zone}</td>
                <td className="p-3 text-sm text-slate-600">{zone.population.toLocaleString()}</td>
                <td className="p-3 text-sm font-semibold text-slate-800">{zone.cases.toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(zone.risk)}`}>
                    {zone.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          View Map
        </Button>
        <Button variant="secondary" size="sm" className="flex-1">
          Export Data
        </Button>
      </div>
    </Card>
  );
};

export default ZoneWiseImpact;