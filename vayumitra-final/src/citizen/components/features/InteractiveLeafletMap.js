import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, useMap, Tooltip as LeafletTooltip } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks and recenter
const MapEventHandler = ({ onMapClick, center }) => {
  const map = useMap();

  // Recenter map when city changes
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });

  return null;
};

// Custom tree marker icon
const createTreeIcon = (emoji) => {
  return L.divIcon({
    html: `<div style="font-size: 32px; text-align: center;">${emoji}</div>`,
    className: 'tree-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

const InteractiveLeafletMap = ({ city, treeType, plantedTrees, onTreesPlanted, onTreeRemove }) => {
  const [ripples, setRipples] = useState([]);
  const [newTrees, setNewTrees] = useState([]);
  const [warning, setWarning] = useState(null);

  const treeEmojis = {
    'Banyan': '🌳',
    'Neem': '🌲',
    'Peepal': '🌴',
    'Mango': '🥭',
    'Bamboo': '🎍',
    'Ashoka': '🎋',
    'Jamun': '🍒',
    'Teak': '🪵',
    'Gulmohar': '🌺'
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const handleMapClick = (latlng) => {
    // Check if within allowed radius of city (e.g., 25km)
    const allowedRadius = city.radius || 25; // Default 25km
    const dist = calculateDistance(latlng.lat, latlng.lng, city.coords[0], city.coords[1]);

    if (dist > allowedRadius) {
      setWarning(`Cannot plant here! Please plant within ${allowedRadius}km of ${city.name.split(',')[0]}.`);
      setTimeout(() => setWarning(null), 3000);
      return;
    }

    // Create 5 trees slightly spread around the click point
    const treesToAdd = [];
    const offsets = [
      [0, 0],           // Center
      [0.0002, 0.0002], // Top-right
      [-0.0002, 0.0002], // Top-left
      [0.0002, -0.0002], // Bottom-right
      [-0.0002, -0.0002] // Bottom-left
    ];

    offsets.forEach((offset, index) => {
      treesToAdd.push({
        id: Date.now() + index,
        position: [latlng.lat + offset[0], latlng.lng + offset[1]],
        type: treeType,
        emoji: treeEmojis[treeType] || '🌳',
        location: city.name // Store city to filter later
      });
    });

    // Add ripple effect at click position
    const rippleId = Date.now();
    setRipples(prev => [...prev, {
      id: rippleId,
      lat: latlng.lat,
      lng: latlng.lng
    }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 1000);

    // Show new trees animation
    setNewTrees(treesToAdd.map(t => t.id));
    setTimeout(() => {
      setNewTrees([]);
    }, 1000);

    // Notify parent component
    onTreesPlanted(treesToAdd);
  };

  return (
    <div className="relative">
      <style>
        {`
          .tree-marker {
            background: transparent;
            border: none;
            animation: treeGrow 0.6s ease-out;
          }

          @keyframes treeGrow {
            0% {
              transform: scale(0) rotate(-180deg);
              opacity: 0;
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }

          .tree-marker:hover {
            transform: scale(1.3);
            transition: transform 0.3s ease;
            cursor: pointer;
            filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.6));
          }

          .leaflet-container {
            border-radius: 1rem;
            z-index: 1;
          }

          .ripple-effect {
            position: absolute;
            border: 4px solid #10b981;
            border-radius: 50%;
            animation: ripple 1s ease-out;
            pointer-events: none;
            z-index: 1000;
          }

          @keyframes ripple {
            0% {
              width: 0;
              height: 0;
              opacity: 1;
            }
            100% {
              width: 200px;
              height: 200px;
              opacity: 0;
            }
          }
        `}
      </style>

      {/* Warning Toast */}
      <AnimatePresence>
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1002] bg-red-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm"
          >
            ⚠️ {warning}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple Effects Overlay */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <RippleEffect key={ripple.id} lat={ripple.lat} lng={ripple.lng} />
        ))}
      </AnimatePresence>

      {/* Leaflet Map */}
      <div className="h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-green-200 relative z-10">
        <MapContainer
          center={city.coords}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          {/* OpenStreetMap Tiles - Real Google Maps-like appearance */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Map Event Handler */}
          <MapEventHandler onMapClick={handleMapClick} center={city.coords} />

          {/* Render Planted Trees */}
          {plantedTrees.map((tree) => (
            <Marker
              key={tree.id}
              position={tree.position}
              icon={createTreeIcon(tree.emoji)}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  if (onTreeRemove) onTreeRemove(tree.id);
                }
              }}
            >
              <LeafletTooltip direction="top" offset={[0, -20]} opacity={1}>
                Click to remove
              </LeafletTooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Stats Badge */}
      {plantedTrees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 right-4 z-20 glass-card p-4 bg-white/95 border-2 border-green-300 shadow-xl"
        >
          <div className="text-center">
            <div className="text-3xl font-black text-green-600">{plantedTrees.length}</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Trees Planted</div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2 glass-card px-3 py-2 bg-white/80">
          <span className="text-xl">{treeEmojis[treeType]}</span>
          <span className="text-slate-600 font-semibold">{treeType} Tree</span>
        </div>
        <div className="flex items-center space-x-2 glass-card px-3 py-2 bg-white/80">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-600 font-semibold">Click Map to Plant (5 trees)</span>
        </div>
        <div className="flex items-center space-x-2 glass-card px-3 py-2 bg-white/80">
          <span className="text-xl">🗑️</span>
          <span className="text-slate-600 font-semibold">Click Tree to Remove</span>
        </div>
        <div className="flex items-center space-x-2 glass-card px-3 py-2 bg-white/80">
          <span className="text-slate-600 font-semibold">📍 {city.name}</span>
        </div>
      </div>
    </div>
  );
};

// Ripple Effect Component
const RippleEffect = ({ lat, lng }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 3, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="absolute rounded-full border-4 border-green-500 z-[1001] pointer-events-none"
      style={{
        width: '100px',
        height: '100px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default InteractiveLeafletMap;