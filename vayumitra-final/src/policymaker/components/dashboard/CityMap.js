import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchSensors } from '../../../api/services';

const CityMap = () => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSensors();
        setSensors(data);
      } catch (error) {
        console.error("Error loading sensors for city map:", error);
      }
    };
    loadData();
  }, []);

  if (!sensors.length) return <Card>Loading map...</Card>;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">🗺️ City Map View</h2>
        <div className="flex space-x-2">
          <select className="px-3 py-1 border border-slate-300 rounded-lg text-sm">
            <option>Zones</option>
            <option>Zone A</option>
            <option>Zone B</option>
            <option>Zone C</option>
            <option>Zone D</option>
            <option>Zone E</option>
          </select>
          <select className="px-3 py-1 border border-slate-300 rounded-lg text-sm">
            <option>Layers</option>
            <option>AQI Heatmap</option>
            <option>Sensors Only</option>
            <option>Traffic Overlay</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 h-96 border-2 border-indigo-100">
        {/* Simulated Map with Sensor Markers */}
        <div className="grid grid-cols-3 gap-8 h-full">
          {sensors.slice(0, 9).map((sensor, index) => (
            <div
              key={sensor.id}
              className="flex items-center justify-center"
            >
              <div
                className={`map-marker ${sensor.aqi > 200 ? 'bg-red-500' :
                    sensor.aqi > 150 ? 'bg-orange-500' :
                      sensor.aqi > 100 ? 'bg-yellow-500' :
                        'bg-green-500'
                  } hover:scale-110 transition-transform cursor-pointer`}
                title={`${sensor.location} - AQI: ${sensor.aqi}`}
              >
                {sensor.aqi}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <p className="text-xs font-semibold text-slate-700 mb-2">Zone-wise AQI</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Unhealthy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Hazardous</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CityMap;