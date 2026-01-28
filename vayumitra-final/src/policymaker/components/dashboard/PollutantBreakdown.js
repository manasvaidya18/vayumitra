
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';

const PollutantBreakdown = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/data/dashboard_stats.json');
        if (res.ok) {
          const data = await res.json();
          setStats(data.live_breakdown);
        }
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  if (!stats) return <Card>Loading Pollutants...</Card>;

  // CPCB National Ambient Air Quality Standards (NAAQS) - 24 hour average
  // These are "Good" category upper limits
  const pollutants = [
    { name: 'PM2.5', value: stats['PM2.5'] || 0, limit: 60, unit: 'µg/m³' },  // Satisfactory limit
    { name: 'PM10', value: stats['PM10'] || 0, limit: 100, unit: 'µg/m³' },   // Satisfactory limit
    { name: 'NO2', value: stats['NO2'] || 0, limit: 80, unit: 'µg/m³' },      // Satisfactory limit
    { name: 'O3', value: stats['O3'] || stats['OZONE'] || 0, limit: 100, unit: 'µg/m³' }, // Satisfactory limit, check both O3 and OZONE
    { name: 'SO2', value: stats['SO2'] || 0, limit: 80, unit: 'µg/m³' },      // Satisfactory limit
    { name: 'CO', value: stats['CO'] || 0, limit: 2.0, unit: 'mg/m³' },       // Satisfactory limit (converted from µg/m³)
  ];

  const getColor = (val, limit) => {
    const ratio = val / limit;
    if (ratio < 0.5) return 'bg-green-500';
    if (ratio < 1.0) return 'bg-yellow-500';
    if (ratio < 2.0) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Pollutant Breakdown (Live)</h2>
      <div className="space-y-4">
        {pollutants.map((pollutant) => {
          // Calculate percentage for bar (cap at 100%)
          // We use 'total width' as roughly 2x limit to show overflow
          const percentage = Math.min((pollutant.value / (pollutant.limit * 2)) * 100, 100);

          return (
            <div key={pollutant.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-slate-700">{pollutant.name}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">{pollutant.value}</span>
                  <span className="text-xs text-slate-500 ml-1">/ {pollutant.limit} (Limit)</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${getColor(pollutant.value, pollutant.limit)} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PollutantBreakdown;