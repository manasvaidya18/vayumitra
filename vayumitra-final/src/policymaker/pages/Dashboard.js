import React from 'react';
import AQIOverview from '../components/dashboard/AQIOverview';
import CityMap from '../components/dashboard/CityMap';
import PollutantBreakdown from '../components/dashboard/PollutantBreakdown';
import WeeklyTrend from '../components/dashboard/WeeklyTrend';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import QuickActions from '../components/dashboard/QuickActions';

const Dashboard = () => {
  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <span>📊</span>
            <span>City Overview Dashboard</span>
          </h1>
          <p className="text-slate-600 mt-1">Real-time air quality monitoring and analytics</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-card">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700">Live Updates</span>
        </div>
      </div>

      {/* AQI Overview Cards */}
      <AQIOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* City Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CityMap />
        </div>

        {/* Pollutant Breakdown - Takes 1 column */}
        <div className="lg:col-span-1">
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