import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchSourceAttribution } from '../../../api/services';

const SourceAttribution = () => {
  const [attribution, setAttribution] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSourceAttribution();
        setAttribution(data);
      } catch (error) {
        console.error("Error loading source attribution:", error);
      }
    };
    loadData();
  }, []);

  if (!attribution.length) return <Card>Loading sources...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Source Attribution</h2>

      <div className="space-y-4">
        {attribution.map((source) => (
          <div key={source.source}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{source.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{source.source}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{source.percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${source.percentage}%`,
                  backgroundColor: source.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SourceAttribution;