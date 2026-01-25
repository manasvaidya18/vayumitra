import React from 'react';
import StatCard from '../common/StatCard';
import { mockTrafficData } from '../../data/mockData';
import { formatNumber } from '../../utils/helpers';

const TrafficMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="🚗 Vehicles On Road"
        value={`${(mockTrafficData.vehiclesOnRoad / 1000000).toFixed(1)}M`}
        subtitle="Currently active"
        trend="15%"
        trendDirection="up"
        color="blue"
      />
      <StatCard
        title="🚦 Congestion Index"
        value={`${mockTrafficData.congestionIndex}%`}
        subtitle="City-wide"
        trend="12%"
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="🏭 Active Factories"
        value={mockTrafficData.activeFactories}
        subtitle="Currently operating"
        color="indigo"
      />
      <StatCard
        title="🏗️ Construction Sites"
        value={mockTrafficData.constructionSites}
        subtitle="Active sites"
        trend="5%"
        trendDirection="down"
        color="green"
      />
      <StatCard
        title="📊 Contribution to AQI"
        value={`${mockTrafficData.contributionToAQI}%`}
        subtitle="From traffic"
        color="red"
      />
    </div>
  );
};

export default TrafficMetrics;