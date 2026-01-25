import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { fetchSensors } from '../../../api/services';
import { getAQIEmoji } from '../../utils/helpers';

const SensorDataTable = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSensors();
        setSensors(data);
      } catch (error) {
        console.error("Error loading sensors:", error);
      }
    };
    loadData();
  }, []);

  if (!sensors.length) return <Card>Loading sensors...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Sensor Data Table</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Sensor</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Zone</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">AQI</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {sensors.slice(0, 6).map((sensor) => (
              <tr key={sensor.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 text-sm font-medium text-slate-800">{sensor.id}</td>
                <td className="p-3 text-sm text-slate-600">{sensor.zone}</td>
                <td className="p-3 text-sm font-bold text-slate-800">{sensor.aqi}</td>
                <td className="p-3 text-sm">
                  <span className="text-xl">{getAQIEmoji(sensor.aqi)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
        <Button variant="secondary" size="sm">
          View All Sensors →
        </Button>
      </div>
    </Card>
  );
};

export default SensorDataTable;