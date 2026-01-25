import React from 'react';
import Card from '../common/Card';
import { mockSensors } from '../../data/mockData';

const RealTimeMap = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📍 Real-Time City Map</h2>
      
      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 h-96 border-2 border-indigo-100">
        <div className="grid grid-cols-4 gap-6 h-full">
          {mockSensors.map((sensor) => (
            <div
              key={sensor.id}
              className="flex items-center justify-center"
            >
              <div className="text-center">
                <div
                  className={`map-marker ${
                    sensor.aqi > 200 ? 'bg-red-500' :
                    sensor.aqi > 150 ? 'bg-orange-500' :
                    sensor.aqi > 100 ? 'bg-yellow-500' :
                    'bg-green-500'
                  } hover:scale-110 transition-transform cursor-pointer`}
                  title={`${sensor.location}`}
                >
                  {sensor.aqi}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">{sensor.id}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-slate-700 mb-2">Legend</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good (0-50)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate (51-100)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Unhealthy (101-200)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Hazardous (200+)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RealTimeMap;