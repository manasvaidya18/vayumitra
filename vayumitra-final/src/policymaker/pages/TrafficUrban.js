import React from 'react';
import TrafficMetrics from '../components/traffic/TrafficMetrics';
import TrafficDensityMap from '../components/traffic/TrafficDensityMap';
import HourlyPattern from '../components/traffic/HourlyPattern';
import EmissionSources from '../components/traffic/EmissionSources';
import CongestionHotspots from '../components/traffic/CongestionHotspots';
import Button from '../components/common/Button';

const TrafficUrban = () => {
  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <span>🚗</span>
          <span>Traffic & Urban Activity Monitoring</span>
        </h1>
        <p className="text-slate-600 mt-1">Analyze traffic patterns and emission sources</p>
      </div>

      {/* Traffic Metrics */}
      <TrafficMetrics />

      {/* Traffic Density Map */}
      <TrafficDensityMap />

      {/* Hourly Pattern and Emission Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HourlyPattern />
        <EmissionSources />
      </div>

      {/* Congestion Hotspots */}
      <CongestionHotspots />

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="primary" icon="📊">
          Traffic Report
        </Button>
        <Button variant="secondary" icon="🚦">
          Suggest Interventions
        </Button>
        <Button variant="secondary" icon="📈">
          Trend Analysis
        </Button>
      </div>
    </div>
  );
};

export default TrafficUrban;