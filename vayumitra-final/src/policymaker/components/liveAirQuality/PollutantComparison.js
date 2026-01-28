import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchDashboardStats, fetchSensors } from '../../../api/services';

const PollutantComparison = ({ selectedStation }) => {
  const [pollutants, setPollutants] = useState([]);
  const [title, setTitle] = useState("📊 Pollutant Comparison");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (selectedStation && selectedStation !== 'All Stations') {
          const sensors = await fetchSensors();
          const station = sensors.find(s => s.id === selectedStation);
          if (station) {
            setTitle(`📊 ${selectedStation} Pollutants`);
            const pList = [
              { name: 'PM2.5', value: station.pm25, status: getStatusEmoji('PM2.5', station.pm25) },
              { name: 'PM10', value: station.pm10, status: getStatusEmoji('PM10', station.pm10) },
              { name: 'NO2', value: station.no2, status: getStatusEmoji('NO2', station.no2) },
              { name: 'O3', value: station.o3, status: getStatusEmoji('O3', station.o3) },
              { name: 'SO2', value: station.so2, status: getStatusEmoji('SO2', station.so2) },
              { name: 'CO', value: station.co, status: getStatusEmoji('CO', station.co) },
            ];
            setPollutants(pList);
            return;
          }
        }

        setTitle("📊 Pollutant Comparison (Avg across all stations)");
        const stats = await fetchDashboardStats();
        if (stats && stats.live_breakdown) {
          const pList = Object.entries(stats.live_breakdown).map(([key, val]) => ({
            name: key,
            value: val,
            status: getStatusEmoji(key, val)
          }));
          setPollutants(pList);
        }
      } catch (e) {
        console.error("Failed to load pollutants", e);
      }
    };
    loadData();
  }, [selectedStation]);

  const getStatusEmoji = (name, value) => {
    // Simple thresholds
    if (name === 'PM2.5') return value > 60 ? '🔴' : value > 30 ? '🟠' : '🟢';
    if (name === 'PM10') return value > 100 ? '🔴' : value > 60 ? '🟠' : '🟢';
    if (name === 'NO2') return value > 80 ? '🔴' : value > 40 ? '🟠' : '🟢';
    return '🟢';
  };

  if (!pollutants.length) return <Card>Loading pollutants...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        {title}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {pollutants.map((pollutant) => (
          <div
            key={pollutant.name}
            className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-4 text-center border border-slate-200"
          >
            <p className="text-sm font-semibold text-slate-700 mb-2">{pollutant.name}</p>
            <p className="text-3xl font-bold text-slate-800 mb-2">{pollutant.value}</p>
            <p className="text-2xl">{pollutant.status}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PollutantComparison;