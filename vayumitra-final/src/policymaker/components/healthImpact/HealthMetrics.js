import React, { useEffect, useState } from 'react';
import StatCard from '../common/StatCard';
import { fetchHealthData } from '../../../api/services';
import { formatNumber, formatCurrency } from '../../utils/helpers';

const HealthMetrics = () => {
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Live Station Data for calculation
        const response = await fetch('/data/station_rankings.json');
        if (response.ok) {
          const stations = await response.json();

          // Import model dynamically or use if imported at top (I'll add import below)
          const { calculateHealthImpacts } = require('../../utils/health_impact_model');

          const impact = calculateHealthImpacts(stations);
          if (impact && impact.cityTotal) {
            setHealthData({
              respiratory: impact.cityTotal.cases * 0.45, // approx share
              cardiac: impact.cityTotal.cases * 0.35,
              asthma: impact.cityTotal.cases * 0.20,
              total: impact.cityTotal.cases,
              cost: impact.cityTotal.formattedCost
            });
          }
        }
      } catch (error) {
        console.error("Error loading health metrics:", error);
      }
    };
    loadData();
  }, []);

  if (!healthData) return <div className="p-4 text-center">Loading health impact estimates...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="🫁 Est. Respiratory Cases"
        value={formatNumber(Math.round(healthData.respiratory))}
        subtitle="Daily excess cases"
        trend="High"
        trendDirection="up"
        color="red"
      />
      <StatCard
        title="❤️ Est. Cardiac Events"
        value={formatNumber(Math.round(healthData.cardiac))}
        subtitle="Daily excess risk"
        trend="High"
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="🏥 Asthma ER Visits"
        value={formatNumber(Math.round(healthData.asthma))}
        subtitle="Daily excess visits"
        trend="Severe"
        trendDirection="up"
        color="orange"
      />
      <StatCard
        title="💰 Est. Economic Loss"
        value={healthData.cost}
        subtitle="Daily burden (medical + lost productivity)"
        color="red"
      />
    </div>
  );
};

export default HealthMetrics;