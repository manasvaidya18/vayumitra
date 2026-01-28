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

  // Pollutants to display
  const pollutants = [
    { label: 'PM2.5', value: hotspot.pm25, unit: 'µg/m³', color: 'bg-red-100 text-red-700' },
    { label: 'PM10', value: hotspot.pm10, unit: 'µg/m³', color: 'bg-orange-100 text-orange-700' },
    { label: 'NO2', value: hotspot.no2, unit: 'µg/m³', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'SO2', value: hotspot.so2, unit: 'µg/m³', color: 'bg-green-100 text-green-700' },
    { label: 'CO', value: hotspot.co, unit: 'mg/m³', color: 'bg-green-100 text-green-700' },
    { label: 'O3', value: hotspot.o3, unit: 'µg/m³', color: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            📊 Hotspot Analysis
          </h2>
          <p className="text-lg font-semibold text-indigo-600 mt-1">
            {hotspot.name}
          </p>
          <p className="text-xs text-slate-500">
            Lat: {hotspot.lat?.toFixed(4) || 'N/A'}, Lng: {hotspot.lng?.toFixed(4) || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-800">{hotspot.aqi}</div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current AQI</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {pollutants.map((p, i) => (
          <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-500 mb-1">{p.label}</span>
            <span className={`text-lg font-bold ${p.value > 100 ? 'text-red-600' : 'text-slate-800'}`}>
              {p.value || '-'}
            </span>
            <span className="text-[10px] text-slate-400">{p.unit}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-4 border border-indigo-100">
        <h4 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-2">Primary Contributors</h4>
        {/* Simple logic to show top pollutant */}
        <div className="flex justify-between py-1">
          <span className="text-sm font-medium text-slate-600">Dominant Pollutant:</span>
          <span className="text-sm font-bold text-red-600">
            {['PM2.5', 'PM10', 'NO2'].sort((a, b) => (hotspot[b.toLowerCase().replace('.', '')] || 0) - (hotspot[a.toLowerCase().replace('.', '')] || 0))[0]}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-sm font-medium text-slate-600">Health Impact:</span>
          <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${hotspot.aqi > 400 ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'}`}>
            {hotspot.aqi > 400 ? 'SEVERE' : hotspot.aqi > 300 ? 'VERY POOR' : 'POOR'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <Button variant="primary" className="flex-1 text-sm py-2">
          Generate Report
        </Button>
        <Button variant="secondary" className="flex-1 text-sm py-2">
          Deploy Mobile Unit
        </Button>
      </div>
    </Card>
  );
};

export default HotspotDetails;