import React, { useEffect, useState } from 'react';
import StatCard from '../common/StatCard';
import { fetchTrafficData } from '../../../api/services';
import { formatNumber } from '../../utils/helpers';

const TrafficMetrics = () => {
  const [trafficData, setTrafficData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTrafficData();
        setTrafficData(data);
      } catch (error) {
        console.error("Error loading traffic metrics:", error);
      }
    };
    loadData();
  }, []);

  if (!trafficData) return <div className="p-4 text-center">Loading metrics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="🚗 Vehicles On Road"
        value={`${(trafficData.vehiclesOnRoad / 1000000).toFixed(1)}M`}
        subtitle="Currently active"
        trend="15%"
        trendDirection="up"
        color="blue"
      />
      <StatCard
        title="🚦 Congestion Index"
        value={`${trafficData.congestionIndex}%`}
        subtitle="City-wide"
        trend="12%"
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="🏭 Active Factories"
        value={trafficData.activeFactories}
        subtitle="Currently operating"
        color="indigo"
      />
      <StatCard
        title="🏗️ Construction Sites"
        value={trafficData.constructionSites}
        subtitle="Active sites"
        trend="5%"
        trendDirection="down"
        color="green"
      />
      <StatCard
        title="📊 Contribution to AQI"
        value={`${trafficData.contributionToAQI}%`}
        subtitle="From traffic"
        color="red"
      />
    </div>
  );
};

export default TrafficMetrics;