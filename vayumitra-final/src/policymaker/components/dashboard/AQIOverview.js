import React from 'react';
import StatCard from '../common/StatCard';

const AQIOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="🌡️ AQI"
        value="142"
        subtitle="UNHEALTHY"
        trend="12% worse"
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="🏭 Active Sources"
        value="47"
        subtitle="Pollution sources"
        color="indigo"
      />
      <StatCard
        title="⚠️ Alerts"
        value="8"
        subtitle="3 High, 5 Medium"
        trend="2 new"
        trendDirection="up"
        color="red"
      />
      <StatCard
        title="📈 Trend (7 days)"
        value="↑ 12%"
        subtitle="Getting worse"
        color="red"
      />
    </div>
  );
};

export default AQIOverview;