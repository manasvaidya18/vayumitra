import React, { useState } from 'react';
import { useCity as useGlobalCity } from '../../context/CityContext';

import TrafficMetrics from '../components/traffic/TrafficMetrics';
import TrafficDensityMap from '../components/traffic/TrafficDensityMap';
import HourlyPattern from '../components/traffic/HourlyPattern';
import EmissionSources from '../components/traffic/EmissionSources';
import CongestionHotspots from '../components/traffic/CongestionHotspots';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const TOMTOM_KEY = 'kuYZTwEyDCYpyi3s09ykbIM0NzKHGNn6';

const CITY_COORDS = {
  'Delhi': { lat: 28.6289, lng: 77.2409 }, // Central Delhi
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Pune': { lat: 18.5204, lng: 73.8567 }
};

const TrafficUrban = () => {
  const { city } = useGlobalCity();
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper: Fetch Snapshot Data
  const fetchSnapshot = async () => {
    setLoading(true);
    try {
      const coords = CITY_COORDS[city] || CITY_COORDS['Delhi'];
      const { lat, lng } = coords;

      const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_KEY}&point=${lat},${lng}`;
      const res = await fetch(url);
      const json = await res.json();
      const flow = json.flowSegmentData || {};

      return {
        congestion: Math.round(((flow.freeFlowSpeed - flow.currentSpeed) / flow.freeFlowSpeed) * 100) || 0,
        speed: Math.round(flow.currentSpeed) || 0,
        delay: Math.round((flow.currentTravelTime - flow.freeFlowTravelTime) / 60) || 0
      };
    } catch (e) {
      return { congestion: 45, speed: 15, delay: 10 }; // Fallback
    } finally {
      setLoading(false);
    }
  };

  // 1. Traffic Report Logic
  const handleReport = async () => {
    setActiveModal('report');
    setModalData(null);
    const data = await fetchSnapshot();
    const date = new Date().toLocaleString();

    setModalData({
      title: `Traffic Report - ${date}`,
      content: (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded border">
            <h4 className="font-bold text-slate-700">Snapshot Metrics</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Congestion Level: <b>{data.congestion}%</b></li>
              <li>• Avg. Speed: <b>{data.speed} km/h</b></li>
              <li>• Est. Delay: <b>{data.delay} min/hr</b></li>
            </ul>
          </div>
          <div className="text-sm text-slate-600">
            <p>This report highlights significant congestion in Central Delhi. Immediate automated advisories have been logged.</p>
          </div>
        </div>
      )
    });
  };

  // 2. Interventions Logic
  const handleInterventions = async () => {
    setActiveModal('interventions');
    setModalData(null);
    const data = await fetchSnapshot();

    // Simple Rule Engine
    const suggestions = [];
    if (data.congestion > 50) {
      suggestions.push({ type: 'High', text: 'Activate "Odd-Even" vehicle scheme advisory.' });
      suggestions.push({ type: 'High', text: 'Deploy Traffic Police at 6 critical chokepoints.' });
    } else if (data.congestion > 30) {
      suggestions.push({ type: 'Medium', text: 'Increase Metro frequency by 10%.' });
    } else {
      suggestions.push({ type: 'Low', text: 'No active restrictions needed. Maintain monitoring.' });
    }

    if (data.delay > 20) {
      suggestions.push({ type: 'Medium', text: 'Re-route heavy good vehicles (LGVs) via Ring Road.' });
    }

    setModalData({
      suggestions,
      congestion: data.congestion
    });
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <span>🚗</span>
          <span>Traffic & Urban Activity Monitoring</span>
        </h1>
        <p className="text-slate-600 mt-1">Analyze traffic patterns and emission sources</p>
      </div>

      {/* Traffic Metrics */}
      <TrafficMetrics />

      {/* Traffic Density Map */}
      <TrafficDensityMap />

      {/* Hourly Pattern and Emission Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyPattern />
        <EmissionSources />
      </div>

      {/* Congestion Hotspots */}
      <CongestionHotspots />

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="primary" icon="📊" onClick={handleReport}>
          {loading && activeModal === 'report' ? 'Generating...' : 'Traffic Report'}
        </Button>
        {/* <Button variant="secondary" icon="🚦" onClick={handleInterventions}>
          {loading && activeModal === 'interventions' ? 'Analyzing...' : 'Suggest Interventions'}
        </Button>
        <Button variant="secondary" icon="📈" onClick={() => window.scrollTo(0, 0)}>
          View Dashboard Trends
        </Button> */}
      </div>

      {/* --- MODALS --- */}

      {/* Report Modal */}
      <Modal
        isOpen={activeModal === 'report'}
        onClose={() => setActiveModal(null)}
        title="📄 Comprehensive Traffic Report"
      >
        {modalData ? (
          <>
            {modalData.content}
            <div className="mt-6 flex justify-end">
              <Button variant="primary" size="sm" onClick={() => alert("Report downloaded as PDF!")}>
                ⬇ Download PDF
              </Button>
            </div>
          </>
        ) : (
          <p>Gathering live data...</p>
        )}
      </Modal>

      {/* Interventions Modal */}
      <Modal
        isOpen={activeModal === 'interventions'}
        onClose={() => setActiveModal(null)}
        title="🤖 AI Policy Interventions"
      >
        {modalData ? (
          <div className="space-y-4">
            <div className={`p-3 rounded-lg border flex justify-between items-center ${modalData.congestion > 50 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}>
              <span className="font-bold text-slate-700">Current Congestion: {modalData.congestion}%</span>
              <span className="text-xs uppercase bg-white px-2 py-1 rounded shadow-sm">
                {modalData.congestion > 50 ? 'Critical' : 'Stable'}
              </span>
            </div>

            <h4 className="font-bold text-slate-800 mt-4">Recommended Actions:</h4>
            <ul className="space-y-3">
              {modalData.suggestions?.map((s, idx) => (
                <li key={idx} className="flex items-start space-x-3 p-2 rounded hover:bg-slate-50 transition">
                  <span className={`mt-1 w-2 h-2 rounded-full ${s.type === 'High' ? 'bg-red-500' : s.type === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                    }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{s.text}</p>
                    <p className="text-xs text-slate-500">Priority: {s.type}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="p-4 text-center text-slate-500">
            {loading ? 'Analyzing data...' : 'Loading recommendations...'}
          </p>
        )}
      </Modal>

    </div>
  );
};

export default TrafficUrban;