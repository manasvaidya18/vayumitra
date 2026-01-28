import React, { useState } from 'react';
import AQIOverview from '../components/dashboard/AQIOverview';
import BlockHeatmap from '../components/dashboard/BlockHeatmap';
import PollutantBreakdown from '../components/dashboard/PollutantBreakdown';
import WeeklyTrend from '../components/dashboard/WeeklyTrend';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import QuickActions from '../components/dashboard/QuickActions';
import CitySelector from '../components/dashboard/CitySelector';
import HotspotRankings from '../components/dashboard/HotspotRankings';

const Dashboard = () => {
  const [city, setCity] = useState('Delhi');

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <span>📊</span>
            <span>City Overview Dashboard</span>
          </h1>
          <p className="text-slate-600 mt-1">Real-time air quality monitoring and analytics</p>
        </div>

        <div className="flex items-center gap-3">
          <CitySelector selectedCity={city} onCityChange={setCity} />

          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-card">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Live Updates</span>
          </div>
        </div>
      </div>

      {/* AQI Overview Cards */}
      <AQIOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* City Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <BlockHeatmap
            dataUrl="http://localhost:8000/api/ml/forecast-3day"
            title="Delhi 72-Hour Prediction Matrix (Live AI)"
          />
        </div>

        {/* Right Sidebar - Hotspots & Pollutants */}
        <div className="lg:col-span-1 space-y-6">
          <HotspotRankings />
          <PollutantBreakdown />
        </div>
      </div>

      {/* Weekly Trend and Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyTrend />
        <RecentAlerts />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;