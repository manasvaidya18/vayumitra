import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const HotspotDetails = ({ hotspot }) => {
  if (!hotspot) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Hotspot Details</h2>
        <div className="text-center py-12 text-slate-500">
          <p className="text-4xl mb-4">📍</p>
          <p>Select a hotspot to view details</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        📊 Hotspot Details
      </h2>
      <p className="text-lg font-semibold text-indigo-600 mb-4">
        Selected: {hotspot.location}
      </p>

      <div className="space-y-3 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-4 border border-indigo-100">
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-sm font-medium text-slate-600">Peak Hours:</span>
          <span className="text-sm font-bold text-slate-800">{hotspot.peakHours}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-sm font-medium text-slate-600">Primary Source:</span>
          <span className="text-sm font-bold text-slate-800">{hotspot.primarySource}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-sm font-medium text-slate-600">Duration:</span>
          <span className="text-sm font-bold text-slate-800">{hotspot.duration}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-sm font-medium text-slate-600">Affected Population:</span>
          <span className="text-sm font-bold text-slate-800">{hotspot.population.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-sm font-medium text-slate-600">Health Risk:</span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            hotspot.healthRisk === 'SEVERE' ? 'bg-red-100 text-red-700' :
            hotspot.healthRisk === 'HIGH' ? 'bg-orange-100 text-orange-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {hotspot.healthRisk}
          </span>
        </div>
      </div>

      <div className="mt-4 flex space-x-3">
        <Button variant="primary" className="flex-1">
          Generate Report
        </Button>
        <Button variant="secondary" className="flex-1">
          Take Action
        </Button>
      </div>
    </Card>
  );
};

export default HotspotDetails;