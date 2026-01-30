import React, { useState, useEffect } from 'react';
import { useCity as useGlobalCity } from '../../context/CityContext';
import VulnerablePopulations from '../components/healthImpact/VulnerablePopulations';
import DiseaseBreakdown from '../components/healthImpact/DiseaseBreakdown';
import Button from '../components/common/Button';

const HealthImpact = () => {
  const { city } = useGlobalCity();
  const [currentAQI, setCurrentAQI] = useState(180);

  // Reset to loading state only if needed, but prefer keeping stale data over 0
  // useEffect(() => { setCurrentAQI(0); }, [city]); <-- Removed this to prevent 'AQI 0' flash

  useEffect(() => {
    const fetchAQI = async () => {
      try {
        const res = await fetch('/api/policymaker/sensors');
        if (res.ok) {
          const sensors = await res.json();
          // Robust filtering for Pune/Delhi
          const citySensors = sensors.filter(s => {
            if (city === 'Pune') return s.location.includes('Pune') || s.location.includes('Shivajinagar') || s.location.includes('Katraj');
            return !s.location.includes('Pune'); // Default to Delhi
          });

          if (citySensors.length > 0) {
            const avg = Math.round(citySensors.reduce((sum, s) => sum + s.aqi, 0) / citySensors.length);
            setCurrentAQI(avg);
          } else {
            // Fallback if API returns empty list for city
            setCurrentAQI(city === 'Pune' ? 178 : 375);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live AQI", e);
        // Fallback on error
        setCurrentAQI(city === 'Pune' ? 178 : 375);
      }
    };
    fetchAQI();
  }, [city]);

  const handleGenerateReport = () => {
    alert("Health Report Generation is coming soon! We are integrating hospital APIs.");
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <span>🏥</span>
            <span>Health Impact Analysis</span>
          </h1>
          <p className="text-slate-600 mt-1">Monitor air quality effects on public health in <b>{city}</b></p>
        </div>
      </div>

      {/* Health Metrics & Correlation - Coming Soon */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-4">🩺</div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Health Impact Analysis Coming Soon</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          We are currently integrating hospital admission data and real-time health registries to provide accurate epidemiological modeling. This feature will be available in the next release.
        </p>
      </div>

      {/* Vulnerable Populations and Zone Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerablePopulations city={city} currentAQI={currentAQI} />
        {/* <ZoneWiseImpact /> */}
        <DiseaseBreakdown city={city} currentAQI={currentAQI} />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleGenerateReport}
          className="px-6 py-3 bg-slate-100 text-slate-500 border-2 border-slate-200 rounded-lg font-medium cursor-not-allowed flex items-center space-x-2"
        >
          <span>📋</span>
          <span>Generate Health Report (Coming Soon)</span>
        </button>
      </div>
    </div>
  );
};

export default HealthImpact;