import React from 'react';
import Card from '../common/Card';

const HeatmapView = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🗺️ Heatmap View</h2>
      
      {/* Heatmap Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 h-96 border-2 border-indigo-100">
        {/* Simulated Heatmap */}
        <div className="absolute inset-8 grid grid-cols-8 gap-1">
          {Array.from({ length: 64 }).map((_, i) => {
            const intensity = Math.random();
            const getColor = () => {
              if (intensity > 0.7) return 'bg-red-600';
              if (intensity > 0.5) return 'bg-orange-500';
              if (intensity > 0.3) return 'bg-yellow-400';
              return 'bg-green-300';
            };
            return (
              <div
                key={i}
                className={`${getColor()} rounded-sm`}
                style={{ opacity: intensity }}
              ></div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3">
          <select className="px-3 py-1 border border-slate-300 rounded text-sm">
            <option>PM2.5</option>
            <option>PM10</option>
            <option>NO2</option>
            <option>All</option>
          </select>
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-slate-100 rounded">◀</button>
            <input type="range" className="w-32" />
            <button className="p-1 hover:bg-slate-100 rounded">▶</button>
          </div>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">▶ Play</button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-slate-700 mb-2">Density</p>
          <div className="flex items-center space-x-1">
            <div className="w-8 h-3 bg-gradient-to-r from-green-300 via-yellow-400 via-orange-500 to-red-600 rounded"></div>
            <div className="flex justify-between w-full text-xs text-slate-600">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeatmapView;