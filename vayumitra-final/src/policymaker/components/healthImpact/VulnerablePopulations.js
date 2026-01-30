import React, { useEffect, useState } from 'react';
import Card from '../common/Card';

const VulnerablePopulations = ({ city, currentAQI }) => {
  const [populations, setPopulations] = useState([]);

  useEffect(() => {
    // City Population Baselines (approx 2024 estimates)
    const CITY_POP = {
      'Delhi': 33000000,
      'Pune': 7000000
    };

    const totalPop = CITY_POP[city] || 10000000; // Default buffer

    // Demographic Ratios (Census/NHFS avg)
    const ratios = {
      'Children 0-5': 0.09,
      'Elderly 60+': 0.08,
      'Pregnant Women': 0.025,
      'Outdoor Workers': 0.15,
      'Asthmatics/COPD': 0.12 // Estimated prevalence
    };

    const calculateRisk = (aqi, group) => {
      let baseRisk = Math.min(10, Math.ceil(aqi / 40));
      // Multipliers
      if (group.includes('Asthma') || group.includes('Children')) baseRisk += 1;
      if (group.includes('Elderly')) baseRisk += 1;
      return Math.min(10, baseRisk);
    };

    const baseGroups = [
      { group: 'Children 0-5', icon: '👶' },
      { group: 'Elderly 60+', icon: '👴' },
      { group: 'Pregnant Women', icon: '🤰' },
      { group: 'Outdoor Workers', icon: '👷' },
      { group: 'Asthmatics/COPD', icon: '🫁' }
    ];

    const updated = baseGroups.map(g => {
      const popSize = Math.round(totalPop * ratios[g.group]);
      return {
        ...g,
        population: popSize,
        risk: calculateRisk(currentAQI, g.group)
      };
    });

    setPopulations(updated);
  }, [city, currentAQI]);

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
                  className={`h-full ${group.risk >= 8 ? 'bg-red-600' : group.risk >= 5 ? 'bg-orange-500' : 'bg-yellow-400'} rounded-full transition-all duration-500`}
                  style={{ width: `${(group.risk / 10) * 100}%` }}
                ></div>
              </div>
              <span className={`text-xs font-bold w-12 ${group.risk >= 8 ? 'text-red-700' : 'text-slate-600'}`}>Risk: {group.risk}/10</span>
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