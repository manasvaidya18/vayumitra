import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchSourceAttribution } from '../../../api/services';

const SourceAttribution = ({ timeFilter }) => {
  const [attribution, setAttribution] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let url = '/api/policymaker/source-attribution'; // Default live
        // Since we are serving static files via API or direct public folder
        // The API endpoint /api/policymaker/source-attribution serves the live/generated file.
        // For 7d, we need to point to the new file.

        // If we want to stay consistent with other components fetching from /data/
        if (timeFilter === 'week' || timeFilter === 'month') {
          url = '/data/source_attribution_7d.json';
        } else {
          // Use the generated live file directly to avoid API routing latency/cache issues
          url = '/data/source_attribution.json';
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setAttribution(data);
        } else {
          // Fallback to API if direct file fails (e.g. first run)
          if (url === '/data/source_attribution.json') {
            const apiRes = await fetch('/api/policymaker/source-attribution');
            if (apiRes.ok) setAttribution(await apiRes.json());
          }
        }
      } catch (error) {
        console.error("Error loading source attribution:", error);
      }
    };
    loadData();
  }, [timeFilter]);

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