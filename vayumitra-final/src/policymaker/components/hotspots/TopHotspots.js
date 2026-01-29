import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchHotspots } from '../../../api/services';

const TopHotspots = ({ onSelectHotspot, timeFilter, city }) => {
  const [hotspots, setHotspots] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Use live rankings API which is now city-aware
        let url = `/api/policymaker/rankings?city=${city}`;

        // For 'week'/'month', ideally backend should support history rankings
        // But current rankings are live. We'll stick to live for now as per user request
        // "in today it should show todys real time aqis"
        // User asked "update station wise thing with city". 
        // We'll use the same live endpoint since history aggregation for ranking is complex/not built yet.

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setHotspots(data);
          // Auto-select first hotspot if none selected
          if (data.length > 0) {
            onSelectHotspot(data[0]);
          }
        }
      } catch (error) {
        console.error("Error loading hotspots:", error);
      }
    };
    loadData();
  }, [timeFilter, city]);

  if (!hotspots.length) return <Card>Loading real-time hotspots...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">{showAll ? '🏆 All Hotspots' : '🏆 Top 10 Hotspots'}</h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {hotspots.slice(0, showAll ? undefined : 10).map((hotspot, index) => (
          <div
            key={index}
            onClick={() => onSelectHotspot(hotspot)}
            className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index < 3 ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{hotspot.name}</p>
                  <p className="text-xs text-slate-600">Station ID: {index + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${hotspot.aqi > 400 ? 'text-red-700' :
                  hotspot.aqi > 300 ? 'text-red-600' :
                    'text-orange-600'
                  }`}>{hotspot.aqi}</p>
                <p className="text-xs text-slate-600">AQI</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAll(!showAll)}
        className="w-full mt-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-sm transition-colors"
      >
        {showAll ? 'Show Top 10' : 'View All Hotspots →'}
      </button>
    </Card>
  );
};

export default TopHotspots;