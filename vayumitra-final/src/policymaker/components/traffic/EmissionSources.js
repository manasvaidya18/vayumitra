import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchEmissions } from '../../../api/services';

const EmissionSources = () => {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEmissions();
        setSources(data);
      } catch (error) {
        console.error("Error loading emissions:", error);
      }
    };
    loadData();
  }, []);

  if (!sources.length) return <Card>Loading emissions...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🏭 Emission Sources</h2>

      <div className="space-y-4">
        {sources.map((source) => (
          <div key={source.source}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{source.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{source.source}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{source.contribution}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${source.contribution}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <p className="text-sm font-semibold text-slate-700">
          Total Traffic Contribution: <span className="text-indigo-600">85%</span>
        </p>
        <p className="text-xs text-slate-600 mt-1">
          Combined private vehicles, trucks, and two-wheelers
        </p>
      </div>
    </Card>
  );
};

export default EmissionSources;