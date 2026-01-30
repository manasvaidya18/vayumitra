
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';

const PollutantBreakdown = ({ city = 'Delhi' }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch from policymaker sensors API which has complete pollutant data
        const res = await fetch(`/api/policymaker/sensors?city=${city}`);
        if (res.ok) {
          const sensors = await res.json();

          // Calculate average pollutants from all active sensors
          const activeSensors = sensors.filter(s => s.aqi > 0 && s.status === 'Live');

          if (activeSensors.length > 0) {
            const breakdown = {
              'PM2.5': Math.round(activeSensors.reduce((sum, s) => sum + (s.pm25 || 0), 0) / activeSensors.length),
              'PM10': Math.round(activeSensors.reduce((sum, s) => sum + (s.pm10 || 0), 0) / activeSensors.length),
              'NO2': Math.round(activeSensors.reduce((sum, s) => sum + (s.no2 || 0), 0) / activeSensors.length),
              'O3': Math.round(activeSensors.reduce((sum, s) => sum + (s.o3 || 0), 0) / activeSensors.length),
              'SO2': Math.round(activeSensors.reduce((sum, s) => sum + (s.so2 || 0), 0) / activeSensors.length),
              'CO': (activeSensors.reduce((sum, s) => sum + (s.co || 0), 0) / activeSensors.length).toFixed(1)
            };
            setStats(breakdown);
          }
        }
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, [city]);

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
          // Calculate percentage for bar
          // Show 100% when value reaches limit, allow visual overflow with cap at 100%
          const percentage = Math.min((pollutant.value / pollutant.limit) * 100, 100);

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