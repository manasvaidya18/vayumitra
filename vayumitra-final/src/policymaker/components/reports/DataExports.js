import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const DataExports = () => {
  const [selections, setSelections] = useState({
    sensorData: true,
    aqiHistory: true,
    healthRecords: false,
    trafficData: false,
    weatherData: false
  });

  const handleCheckbox = (key) => {
    setSelections({ ...selections, [key]: !selections[key] });
  };

  const handleExport = () => {
    const selected = Object.entries(selections)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    alert(`Exporting: ${selected.join(', ')}`);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Data Exports</h2>
      
      <div className="space-y-3 mb-4">
        <p className="text-sm font-semibold text-slate-700">Export raw data:</p>
        
        <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
          <input
            type="checkbox"
            checked={selections.sensorData}
            onChange={() => handleCheckbox('sensorData')}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">Sensor Data (CSV)</span>
        </label>

        <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
          <input
            type="checkbox"
            checked={selections.aqiHistory}
            onChange={() => handleCheckbox('aqiHistory')}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">AQI History (JSON)</span>
        </label>

        <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
          <input
            type="checkbox"
            checked={selections.healthRecords}
            onChange={() => handleCheckbox('healthRecords')}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">Health Records</span>
        </label>

        <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
          <input
            type="checkbox"
            checked={selections.trafficData}
            onChange={() => handleCheckbox('trafficData')}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">Traffic Data</span>
        </label>

        <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors">
          <input
            type="checkbox"
            checked={selections.weatherData}
            onChange={() => handleCheckbox('weatherData')}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700">Weather Data</span>
        </label>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="Start date"
          />
          <input
            type="date"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="End date"
          />
        </div>

        <Button variant="primary" icon="📥" onClick={handleExport} className="w-full">
          Export Selected
        </Button>
      </div>
    </Card>
  );
};

export default DataExports;