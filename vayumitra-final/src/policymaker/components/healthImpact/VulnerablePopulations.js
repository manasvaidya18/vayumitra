import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchVulnerablePopulations } from '../../../api/services';

const VulnerablePopulations = () => {
  const [populations, setPopulations] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Live AQI
        const response = await fetch('/data/dashboard_stats.json');
        if (response.ok) {
          const stats = await response.json();
          const currentAQI = stats.live_aqi || 180;

          const { calculateVulnerableRisk } = require('../../utils/health_impact_model');

          // Base populations (Static estimates for Delhi context)
          const baseGroups = [
            { group: 'Children 0-5', population: 1800000, icon: '👶' },
            { group: 'Elderly 60+', population: 2200000, icon: '👴' },
            { group: 'Pregnant Women', population: 650000, icon: '🤰' },
            { group: 'Outdoor Workers', population: 4200000, icon: '👷' },
            { group: 'Asthmatics/COPD', population: 3800000, icon: '🫁' } // Renamed from Pre-existing
          ];

          const updated = baseGroups.map(g => ({
            ...g,
            risk: calculateVulnerableRisk(g.group.split(' ')[0], currentAQI) // Heuristic name match
          }));

          setPopulations(updated);
        }
      } catch (error) {
        console.error("Error loading vulnerable populations:", error);
      }
    };
    loadData();
  }, []);

  if (!populations.length) return <Card>Loading population data...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">👥 Vulnerable Populations</h2>

      <div className="space-y-3">
        {populations.map((group) => (
          <div key={group.group} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{group.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{group.group}</p>
                <p className="text-xs text-slate-600">{group.population.toLocaleString()} people</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 bg-slate-200 rounded-full h-2">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(group.risk / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-red-600 w-12">Risk: {group.risk}/10</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p className="text-sm font-semibold text-slate-700">
          Total At-Risk Population: <span className="text-yellow-700">{(populations.reduce((acc, curr) => acc + curr.population, 0) / 1000000).toFixed(1)} Million</span>
        </p>
      </div>
    </Card>
  );
};

export default VulnerablePopulations;