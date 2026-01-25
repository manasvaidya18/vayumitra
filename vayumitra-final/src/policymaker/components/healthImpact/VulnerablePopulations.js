import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchVulnerablePopulations } from '../../../api/services';

const VulnerablePopulations = () => {
  const [populations, setPopulations] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchVulnerablePopulations();
        setPopulations(data);
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
                  style={{ width: `${(group.risk / 6) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-red-600 w-12">Risk: {group.risk}/6</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <p className="text-sm font-semibold text-slate-700">
          Total At-Risk Population: <span className="text-yellow-700">1.2 Million</span>
        </p>
      </div>
    </Card>
  );
};

export default VulnerablePopulations;