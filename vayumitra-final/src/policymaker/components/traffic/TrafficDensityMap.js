import React from 'react';
import Card from '../common/Card';

const TrafficDensityMap = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🗺️ Traffic Density Map</h2>
      
      {/* Traffic Map */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 h-96 border-2 border-indigo-100">
        {/* Simulated Road Network */}
        <div className="relative h-full">
          {/* Horizontal Roads */}
          <div className="absolute top-1/4 left-0 right-0 h-3 bg-red-500 rounded-full opacity-80 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Heavy Traffic</span>
          </div>
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-yellow-500 rounded-full opacity-80 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Moderate Traffic</span>
          </div>
          <div className="absolute top-3/4 left-0 right-0 h-3 bg-green-500 rounded-full opacity-80 flex items-center justify-center">
            <span className="text-white text-xs font-bold">Light Traffic</span>
          </div>

          {/* Vertical Roads */}
          <div className="absolute left-1/4 top-0 bottom-0 w-3 bg-yellow-500 rounded-full opacity-80"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-3 bg-red-500 rounded-full opacity-80"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-3 bg-green-500 rounded-full opacity-80"></div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-slate-700 mb-2">Traffic Status</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Free Flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Congested</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrafficDensityMap;