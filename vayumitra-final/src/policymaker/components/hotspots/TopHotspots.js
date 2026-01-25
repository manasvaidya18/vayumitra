import React from 'react';
import Card from '../common/Card';
import { mockHotspots } from '../../data/mockData';

const TopHotspots = ({ onSelectHotspot }) => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🏆 Top 10 Hotspots</h2>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {mockHotspots.map((hotspot) => (
          <div
            key={hotspot.rank}
            onClick={() => onSelectHotspot(hotspot)}
            className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {hotspot.rank}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{hotspot.location}</p>
                  <p className="text-xs text-slate-600">Zone {hotspot.zone}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{hotspot.aqi}</p>
                <p className="text-xs text-slate-600">AQI</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-sm transition-colors">
        View All Hotspots →
      </button>
    </Card>
  );
};

export default TopHotspots;