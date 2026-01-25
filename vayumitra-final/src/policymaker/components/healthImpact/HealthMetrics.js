import React, { useEffect, useState } from 'react';
import StatCard from '../common/StatCard';
import { fetchHealthData } from '../../../api/services';
import { formatNumber, formatCurrency } from '../../utils/helpers';

const HealthMetrics = () => {
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHealthData();
        setHealthData(data);
      } catch (error) {
        console.error("Error loading health metrics:", error);
      }
    };
    loadData();
  }, []);

  if (!healthData) return <div className="p-4 text-center">Loading health metrics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="🫁 Respiratory Cases"
        value={formatNumber(healthData.respiratoryCases)}
        subtitle="Annual cases"
        trend={`${healthData.trends.respiratory}%`}
        trendDirection="up"
        color="red"
      />
      <StatCard
        title="❤️ Cardiovascular Cases"
        value={formatNumber(healthData.cardiovascularCases)}
        subtitle="Annual cases"
        trend={`${healthData.trends.cardiovascular}%`}
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="🏥 ER Visits"
        value={formatNumber(healthData.erVisits)}
        subtitle="This month"
        trend={`${healthData.trends.erVisits}%`}
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="💀 Deaths Attributed"
        value={formatNumber(healthData.deaths)}
        subtitle="Annual deaths"
        trend={`${healthData.trends.deaths}%`}
        trendDirection="up"
        color="red"
      />
      <StatCard
        title="💰 Economic Cost"
        value={formatCurrency(healthData.annualCost)}
        subtitle="Annual burden"
        color="red"
      />
    </div>
  );
};

export default HealthMetrics;