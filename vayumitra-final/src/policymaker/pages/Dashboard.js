import React from 'react';
import { useCity } from '../../context/CityContext';
import AQIOverview from '../components/dashboard/AQIOverview';
import BlockHeatmap from '../components/dashboard/BlockHeatmap';
import PollutantBreakdown from '../components/dashboard/PollutantBreakdown';
import WeeklyTrend from '../components/dashboard/WeeklyTrend';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import QuickActions from '../components/dashboard/QuickActions';
// import CitySelector from '../components/dashboard/CitySelector'; // Removed if redundant or bind to context
import HotspotRankings from '../components/dashboard/HotspotRankings';

const Dashboard = () => {
  const { city } = useCity(); // Use Global Context

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
          {/* City Selector is now in Navbar, but we can keep a display or remove it. 
              The task is to make it global. If Navbar has it, we might not need it here.
              However, the user might expect it. Let's rely on Navbar for switching to keep UI clean 
              or if we want it here, we would use the component but redundant. 
              Let's remove it to avoid confusion and rely on the global Navbar selector. 
          */}

          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-card">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Live Updates</span>
          </div>
        </div>
      </div>

      {/* AQI Overview Cards */}
      <AQIOverview city={city} />

      {/* Main Content Grid */}

      <div className="lg:col-span-2">
        <BlockHeatmap
          dataUrl={`/api/ml/forecast-3day?city=${city}`}
          title={`${city} 72-Hour Prediction Matrix (Live AI)`}
          city={city}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotspotRankings city={city} />
        <PollutantBreakdown city={city} />
      </div>

      {/* Weekly Trend and Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyTrend city={city} />
        <RecentAlerts />
      </div>

      {/* Quick Actions */}
      {/* <QuickActions /> */}
    </div>
  );
};

export default Dashboard;