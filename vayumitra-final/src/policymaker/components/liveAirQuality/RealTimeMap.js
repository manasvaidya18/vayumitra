import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchSensors } from '../../../api/services';
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafleft icon
delete L.Icon.Default.prototype._getIconUrl;
try {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
} catch (e) {
  console.warn("Leaflet icons require fix failed", e);
}

const RealTimeMap = ({ selectedStation, city }) => {
  const [sensors, setSensors] = useState([]);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi default

  // Coords helper
  const getCityCoords = (c) => {
    if (c === 'Pune') return [18.5204, 73.8567];
    if (c === 'Mumbai') return [19.0760, 72.8777];
    if (c === 'Bangalore') return [12.9716, 77.5946];
    return [28.6139, 77.2090]; // Delhi
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSensors(city);
        if (data && data.length > 0) {
          const filtered = data.filter(s => s.lat && s.lng);
          setSensors(filtered);

          // If station selected, find it and center
          if (selectedStation && selectedStation !== 'All Stations') {
            const target = filtered.find(s => s.id === selectedStation);
            if (target) {
              setMapCenter([target.lat, target.lng]);
            }
          } else {
            // Center on City
            setMapCenter(getCityCoords(city));
          }
        }
      } catch (error) {
        console.error("Error loading sensors for map:", error);
      }
    };
    loadData();
  }, [selectedStation, city]);

  // Custom component to update map view
  const MapUpdater = ({ center }) => {
    const map = useMap();
    map.setView(center, selectedStation && selectedStation !== 'All Stations' ? 14 : 11);
    return null;
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📍 Real-Time City Map</h2>
      <div className="h-96 rounded-lg overflow-hidden border-2 border-indigo-100 z-0">
        <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
          <MapUpdater center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {sensors.map((s, idx) => (
            <Marker key={idx} position={[s.lat || mapCenter[0], s.lng || mapCenter[1]]}>
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                <div className="text-center p-2 min-w-[120px]">
                  <h3 className="font-bold text-sm border-b pb-1 mb-1 border-slate-200">{s.id}</h3>
                  <div className="text-xl font-bold" style={{
                    color: s.aqi > 200 ? '#ef4444' : s.aqi > 100 ? '#f97316' : '#22c55e'
                  }}>
                    AQI: {s.aqi}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 grid grid-cols-2 gap-x-2 text-left">
                    <span>PM2.5: <b>{s.pm25}</b></span>
                    <span>PM10: <b>{s.pm10}</b></span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default RealTimeMap;