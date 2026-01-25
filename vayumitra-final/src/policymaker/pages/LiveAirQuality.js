import React, { useState } from 'react';
import FilterBar from '../components/common/FilterBar';
import RealTimeMap from '../components/liveAirQuality/RealTimeMap';
import SensorDataTable from '../components/liveAirQuality/SensorDataTable';
import LiveTrendChart from '../components/liveAirQuality/LiveTrendChart';
import PollutantComparison from '../components/liveAirQuality/PollutantComparison';

const LiveAirQuality = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <span>🌬️</span>
            <span>Live Air Quality Monitoring</span>
          </h1>
          <p className="text-slate-600 mt-1">Real-time sensor data and analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoRefresh
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span className={autoRefresh ? 'animate-spin' : ''}>🔄</span>
            <span className="font-medium">Auto-refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar>
        <input type="date" className="px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
          <option>All Zones</option>
          <option>Zone A</option>
          <option>Zone B</option>
          <option>Zone C</option>
          <option>Zone D</option>
          <option>Zone E</option>
        </select>
        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
          <option>All Pollutants</option>
          <option>PM2.5</option>
          <option>PM10</option>
          <option>NO2</option>
          <option>O3</option>
        </select>
        <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
          <option>All Sensors</option>
          <option>Online Only</option>
          <option>Offline Only</option>
        </select>
      </FilterBar>

      {/* Real-Time Map */}
      <RealTimeMap />

      {/* Sensor Data and Live Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorDataTable />
        <LiveTrendChart />
      </div>

      {/* Pollutant Comparison */}
      <PollutantComparison />
    </div>
  );
};

export default LiveAirQuality;