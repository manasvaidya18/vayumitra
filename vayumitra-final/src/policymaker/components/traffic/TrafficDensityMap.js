import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Card from '../common/Card';
import L from 'leaflet';
import { useCity } from '../../../context/CityContext';

// Custom Warning Icon for Jams
const warningIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
           <span class="text-white text-xs font-bold">!</span>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const TOMTOM_KEY = 'kuYZTwEyDCYpyi3s09ykbIM0NzKHGNn6';

// Recenter Map Component
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 11);
  }, [lat, lng, map]);
  return null;
};

// Component to handle map Logic (Incidents Fetching)
const TrafficSignals = () => {
  const map = useMap();
  const [incidents, setIncidents] = useState([]);
  const { city } = useCity(); // To skip if not Delhi

  useEffect(() => {
    const fetchIncidents = async () => {
      // If not Delhi, don't fetch incidents (Dummy mode = clean map or static)
      if (city !== 'Delhi') {
        setIncidents([]);
        return;
      }

      try {
        const bounds = map.getBounds();
        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

        const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&bbox=${bbox}&fields={incidents{geometry{coordinates},properties{iconCategory,magnitudeOfDelay,events{description}}}}&language=en-GB`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.incidents) {
          // Broaden filter: Jams (6), Accidents (1), Roadworks (9)
          // Show ANY accident, but only Jams with >0 delay
          const relevantIncidents = data.incidents.filter(i => {
            const cat = i.properties.iconCategory;
            const delay = i.properties.magnitudeOfDelay || 0;

            const isJam = (cat === 6 && delay > 0);
            const isAccident = (cat === 1);
            const isRoadwork = (cat === 9);

            return isJam || isAccident || isRoadwork;
          }).slice(0, 20); // Show up to 20 markers

          setIncidents(relevantIncidents);
        }
      } catch (e) {
        console.error("Incidents fetch error", e);
      }
    };

    fetchIncidents();
    // Refresh on move end could be added, but for now load once on mount/center
    map.on('moveend', fetchIncidents);
    return () => map.off('moveend', fetchIncidents);
  }, [map, city]);

  return (
    <>
      {incidents.map((inc, idx) => {
        // Validation: Verify geometry holds valid lat/lng
        if (!inc?.geometry?.coordinates || inc.geometry.coordinates.length < 2) return null;

        const [lng, lat] = inc.geometry.coordinates;
        if (typeof lat !== 'number' || typeof lng !== 'number') return null;

        return (
          <Marker
            key={idx}
            position={[lat, lng]}
            icon={warningIcon}
          >
            <Popup className="font-sans">
              <div className="p-1">
                <h3 className="font-bold text-red-700 text-sm">High Traffic</h3>
                <p className="text-xs text-slate-600 mt-1">{inc.properties.events?.[0]?.description || "Congestion detected"}</p>
                <span className="inline-block mt-1 bg-red-100 text-red-800 text-[10px] px-1 rounded">
                  Delay: {Math.round(inc.properties.magnitudeOfDelay || 0)}:00
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const TrafficDensityMap = () => {
  const { city } = useCity();

  // Coordinates Mapping
  const cityCoords = {
    'Delhi': [28.6139, 77.2090],
    'Mumbai': [19.0760, 72.8777],
    'Bangalore': [12.9716, 77.5946],
    'Hyderabad': [17.3850, 78.4867]
  };

  const center = cityCoords[city] || cityCoords['Delhi'];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">🗺️ Real-Time Traffic Density</h2>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          Provider: TomTom Traffic
        </span>
      </div>

      <div className="rounded-lg overflow-hidden border-2 border-slate-200 h-96 relative z-0">
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <RecenterMap lat={center[0]} lng={center[1]} />

          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="TomTom Basic">
              <TileLayer
                url={`https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`}
                attribution='&copy; <a href="https://tomtom.com">TomTom</a>'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
            </LayersControl.BaseLayer>

            {/* 
                Flow Layer: This provides the "Red Paths" (Colored flow lines).
                We use 'relative0' for standard relative speed colors (Green/Orange/Red).
             */}
            <LayersControl.Overlay checked name="Traffic Flow">
              <TileLayer
                url={`https://api.tomtom.com/traffic/map/4/tile/flow/relative0/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`}
                opacity={1.0}
              />
            </LayersControl.Overlay>
          </LayersControl>

          {/* Vector Markers for "Warnings" */}
          <TrafficSignals />
        </MapContainer>
      </div>

      <div className="mt-3 flex items-center justify-end space-x-4 text-xs text-slate-600">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded-full bg-red-600 block"></span>
          <span>Heavy</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded-full bg-orange-400 block"></span>
          <span>Moderate</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
          <span>Free Flow</span>
        </div>
        <div className="flex items-center space-x-1 ml-4 border-l pl-4">
          <div className="w-3 h-3 bg-red-600 rounded-full border border-white shadow animate-pulse flex items-center justify-center text-[8px] text-white font-bold">!</div>
          <span>Jam Warning</span>
        </div>
      </div>
    </Card>
  );
};

export default TrafficDensityMap;