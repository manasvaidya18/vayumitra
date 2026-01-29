import React, { useState } from 'react';
import { useCity as useGlobalCity } from '../../context/CityContext';
import BlockHeatmap from '../components/dashboard/BlockHeatmap';
import TopHotspots from '../components/hotspots/TopHotspots';
import HotspotDetails from '../components/hotspots/HotspotDetails';
import SourceAttribution from '../components/hotspots/SourceAttribution';

const PollutionHotspots = () => {
  const { city } = useGlobalCity();
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [timeFilter, setTimeFilter] = useState('today'); // 'today', 'week', 'month', 'forecast'

  const getHeatmapProps = () => {
    switch (timeFilter) {
      case 'today':
        return {
          range: 'today',
          dataUrl: `/api/ml/history?days=1&city=${city}`, // Use relative path & city
          title: `Air Quality Matrix (Past 24h - Actual) - ${city}`,
          subtitle: 'Measured Data (CPCB/OpenWeatherMap)',
          city: city
        };
      case 'week':
        return {
          range: 'week',
          dataUrl: `/api/ml/history?days=7&city=${city}`,
          title: `Air Quality Matrix (Past 7 Days - Actual) - ${city}`,
          subtitle: 'Measured Data (CPCB/OpenWeatherMap)',
          city: city
        };
      case 'month':
        return {
          range: 'month',
          dataUrl: `/api/ml/history?days=30&city=${city}`,
          title: `Air Quality Matrix (Past 30 Days - Actual) - ${city}`,
          subtitle: 'Measured Data (CPCB/OpenWeatherMap)',
          city: city
        };
      default:
        return {
          range: 'forecast',
          dataUrl: `/api/ml/forecast-3day?city=${city}`,
          title: `${city} 72-Hour Prediction Matrix (Live AI)`,
          subtitle: 'Hourly Forecast (XGBoost Model)',
          city: city
        };
    }
  };

  const heatmapProps = getHeatmapProps();

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
        {['today', 'week', 'month', 'forecast'].map(filter => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${timeFilter === filter
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            {filter === 'forecast' ? 'Prediction (3 Days) 🔮' : filter.replace('week', 'This Week').replace('month', 'This Month')}
          </button>
        ))}
      </div>

      {/* Block Heatmap Matrix */}
      <BlockHeatmap
        {...heatmapProps}
      />

      {/* Top Hotspots and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopHotspots
          onSelectHotspot={setSelectedHotspot}
          timeFilter={timeFilter}
          city={city}
        />
        <HotspotDetails
          hotspot={selectedHotspot}
          timeFilter={timeFilter}
          city={city}
        />
      </div>

      {/* Source Attribution */}
      <SourceAttribution timeFilter={timeFilter} city={city} />
    </div>
  );
};

export default PollutionHotspots;