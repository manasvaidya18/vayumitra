import React from 'react';
import StatCard from '../common/StatCard';
import { mockHealthData } from '../../data/mockData';
import { formatNumber, formatCurrency } from '../../utils/helpers';

const HealthMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="🫁 Respiratory Cases"
        value={formatNumber(mockHealthData.respiratoryCases)}
        subtitle="Annual cases"
        trend={`${mockHealthData.trends.respiratory}%`}
        trendDirection="up"
        color="red"
      />
      <StatCard
        title="❤️ Cardiovascular Cases"
        value={formatNumber(mockHealthData.cardiovascularCases)}
        subtitle="Annual cases"
        trend={`${mockHealthData.trends.cardiovascular}%`}
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="🏥 ER Visits"
        value={formatNumber(mockHealthData.erVisits)}
        subtitle="This month"
        trend={`${mockHealthData.trends.erVisits}%`}
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="💀 Deaths Attributed"
        value={formatNumber(mockHealthData.deaths)}
        subtitle="Annual deaths"
        trend={`${mockHealthData.trends.deaths}%`}
        trendDirection="up"
        color="red"
      />
      <StatCard
        title="💰 Economic Cost"
        value={formatCurrency(mockHealthData.annualCost)}
        subtitle="Annual burden"
        color="red"
      />
    </div>
  );
};

export default HealthMetrics;