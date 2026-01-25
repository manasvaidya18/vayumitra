import React, { useState } from 'react';
import HeatmapView from '../components/hotspots/HeatmapView';
import TopHotspots from '../components/hotspots/TopHotspots';
import HotspotDetails from '../components/hotspots/HotspotDetails';
import SourceAttribution from '../components/hotspots/SourceAttribution';

const PollutionHotspots = () => {
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <span>🔥</span>
          <span>Pollution Hotspots Analysis</span>
        </h1>
        <p className="text-slate-600 mt-1">Identify and analyze pollution concentration areas</p>
      </div>

      {/* Time Period Selector */}
      <div className="flex space-x-3">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
          Today
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">
          This Week
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">
          This Month
        </button>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium">
          Custom 📅
        </button>
      </div>

      {/* Heatmap */}
      <HeatmapView />

      {/* Top Hotspots and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopHotspots onSelectHotspot={setSelectedHotspot} />
        <HotspotDetails hotspot={selectedHotspot} />
      </div>

      {/* Source Attribution */}
      <SourceAttribution />
    </div>
  );
};

export default PollutionHotspots;