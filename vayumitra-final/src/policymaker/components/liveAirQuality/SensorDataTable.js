import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { fetchSensors } from '../../../api/services';
import { getAQIEmoji, getAQIColor, downloadCSV } from '../../utils/helpers';

const SensorDataTable = ({ selectedStation, selectedPollutant }) => {
  const [sensors, setSensors] = useState([]);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSensors();
        let filtered = data;

        if (selectedStation && selectedStation !== 'All Stations') {
          filtered = filtered.filter(s => s.id === selectedStation);
        }

        setSensors(filtered);
      } catch (error) {
        console.error("Error loading sensors:", error);
      }
    };
    loadData();
  }, [selectedStation]); // Re-run when filter changes

  const handleExport = () => {
    if (sensors.length > 0) {
      downloadCSV(sensors, 'sensor_data.csv');
    }
  };

  if (!sensors.length) return <Card>Loading sensors...</Card>;

  const displayedSensors = viewAll ? sensors : sensors.slice(0, 10);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">📊 Sensor Data Table</h2>
        <span className="text-xs text-slate-500">
          {sensors.length} stations found
        </span>
      </div>

      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full relative">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Sensor</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">AQI</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">PM2.5</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">PM10</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedSensors.map((sensor) => (
              <tr key={sensor.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 text-sm font-medium text-slate-800">{sensor.id}</td>
                <td className={`p-3 text-sm font-bold ${getAQIColor(sensor.aqi)}`}>{sensor.aqi}</td>
                <td className="p-3 text-sm text-slate-600">{sensor.pm25}</td>
                <td className="p-3 text-sm text-slate-600">{sensor.pm10}</td>
                <td className="p-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl" title="Category">{getAQIEmoji(sensor.aqi)}</span>
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      <span>Live</span>
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={handleExport}>
          Export CSV
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setViewAll(!viewAll)}>
          {viewAll ? 'Show Less' : 'View All Sensors →'}
        </Button>
      </div>
    </Card>
  );
};

export default SensorDataTable;