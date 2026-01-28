
import React, { useEffect, useState } from 'react';
import StatCard from '../common/StatCard';

const AQIOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/data/dashboard_stats.json');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      }
    };

    // Initial fetch
    fetchStats();

    // Poll every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>;

  const liveAQI = stats.live_aqi || 0;

  // Determine color/text based on AQI
  let status = "Good";
  let color = "green";
  if (liveAQI > 50) { status = "Satisfactory"; color = "green"; }
  if (liveAQI > 100) { status = "Moderate"; color = "yellow"; }
  if (liveAQI > 200) { status = "Poor"; color = "orange"; }
  if (liveAQI > 300) { status = "Very Poor"; color = "red"; }
  if (liveAQI > 400) { status = "Severe"; color = "red"; }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="🌡️ Live City Avg AQI (Real-time)"
        value={liveAQI}
        subtitle={status.toUpperCase()}
        trend="Current readings"
        trendDirection="neutral"
        color={color}
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
        title="📈 Weekly Trend"
        value={stats.weekly_trend ? Math.round(stats.weekly_trend.reduce((sum, day) => sum + day.aqi, 0) / stats.weekly_trend.length) : '-'}
        subtitle="Last 7 Days Avg"
        color="indigo"
      />
    </div>
  );
};

export default AQIOverview;