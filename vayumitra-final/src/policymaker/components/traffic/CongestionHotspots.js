import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchCongestion } from '../../../api/services';

const CongestionHotspots = () => {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCongestion();
        setHotspots(data);
      } catch (error) {
        console.error("Error loading congestion hotspots:", error);
      }
    };
    loadData();
  }, []);

  if (!hotspots.length) return <Card>Loading hotspots...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🚧 Congestion Hotspots</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Location</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Avg. Delay</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Peak Time</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">AQI Impact</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((hotspot, index) => (
              <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 text-sm font-medium text-slate-800">{hotspot.location}</td>
                <td className="p-3 text-sm text-slate-600">{hotspot.delay} min</td>
                <td className="p-3 text-sm text-slate-600">{hotspot.peakTime}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${hotspot.aqiImpact > 35 ? 'bg-red-100 text-red-700' :
                      hotspot.aqiImpact > 25 ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                    +{hotspot.aqiImpact} AQI
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CongestionHotspots;