import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchSensors } from '../../../api/services';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const RealTimeMap = ({ selectedStation }) => {
  const [sensors, setSensors] = useState([]);
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Delhi center

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSensors();
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
            setMapCenter([28.6139, 77.2090]);
          }
        }
      } catch (error) {
        console.error("Error loading sensors for map:", error);
      }
    };
    loadData();
  }, [selectedStation]);

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
            <Marker key={idx} position={[s.lat, s.lng]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">{s.id}</h3>
                  <div className="text-lg font-bold" style={{
                    color: s.aqi > 200 ? '#ef4444' : s.aqi > 100 ? '#f97316' : '#22c55e'
                  }}>
                    AQI: {s.aqi}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    <div>PM2.5: {s.pm25}</div>
                    <div>PM10: {s.pm10}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </Card>
  );
};

export default RealTimeMap;