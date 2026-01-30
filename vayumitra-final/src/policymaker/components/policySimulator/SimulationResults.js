import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { calculatePolicyImpact } from '../../utils/helpers';

const SimulationResults = ({ selectedPolicies, city }) => {
  const [currentAQI, setCurrentAQI] = useState(178); // Default fallback
  const [sourceBreakdown, setSourceBreakdown] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch live sensors for accurate City Average
        const res = await fetch('/api/policymaker/sensors');
        if (res.ok) {
          const sensors = await res.json();
          // Filter sensors for current city
          const citySensors = sensors.filter(s => s.location.includes(city) || (city === 'Delhi' && !s.location.includes('Pune'))); // Fallback logic

          if (citySensors.length > 0) {
            const avg = Math.round(citySensors.reduce((sum, s) => sum + s.aqi, 0) / citySensors.length);
            setCurrentAQI(avg);
          } else {
            // Fallback if no specific match (or mock data needed)
            setCurrentAQI(city === 'Pune' ? 178 : 392);
          }

          // Fetch source breakdown for city (static for now or API if available)
          const srcRes = await fetch(`/api/policymaker/source-attribution?city=${city}`);
          if (srcRes.ok) {
            setSourceBreakdown(await srcRes.json());
          }
        }
      } catch (e) {
        console.error("Simulation data fetch failed", e);
      }
    };
    fetchData();
  }, [city]);

  const { newAQI, totalImpact, percentageChange } = calculatePolicyImpact(selectedPolicies, currentAQI, sourceBreakdown);

  // Calculate dynamic cost and ROI
  const implementationCost = selectedPolicies.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  const healthBenefits = Math.round(Math.abs(totalImpact) * 15); // Rough formula: 15 Cr per AQI point reduced
  const roi = implementationCost > 0 ? (healthBenefits / implementationCost).toFixed(1) : 0;

  return (
    <Card gradient>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Simulation Results</h2>

      <div className="space-y-6">
        {/* Projected Impact */}
        <div className="text-center py-6 bg-white rounded-lg border-2 border-indigo-200">
          <p className="text-sm text-slate-600 mb-2">Projected Impact</p>
          <div className="flex items-center justify-center space-x-8">
            <div>
              <p className="text-xs text-slate-500 mb-1">Current AQI</p>
              <p className="text-4xl font-bold text-red-600">{currentAQI}</p>
            </div>
            <div className="text-4xl text-slate-400">→</div>
            <div>
              <p className="text-xs text-slate-500 mb-1">After Policy</p>
              <p className="text-4xl font-bold text-green-600">{newAQI}</p>
            </div>
          </div>
          <p className="text-lg font-semibold text-indigo-600 mt-4">
            ↓ {Math.abs(percentageChange)}% improvement
          </p>
        </div>

        {/* Timeline Visualization */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Now</span>
              <span className="text-sm font-medium text-slate-700">6 months</span>
            </div>
            <div className="relative w-full bg-slate-200 rounded-full h-4">
              <div
                className="absolute h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
                style={{ width: '100%' }}
              ></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-green-600 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Cost-Benefit Analysis */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Implementation Cost</p>
            <p className="text-2xl font-bold text-slate-800">₹{implementationCost} Cr</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">Health Benefits (saved)</p>
            <p className="text-2xl font-bold text-green-600">₹{healthBenefits} Cr</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-slate-200">
            <p className="text-xs text-slate-600 mb-1">ROI</p>
            <p className="text-2xl font-bold text-indigo-600">{roi}x</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SimulationResults;