import React from 'react';
import HealthMetrics from '../components/healthImpact/HealthMetrics';
import CorrelationChart from '../components/healthImpact/CorrelationChart';
import VulnerablePopulations from '../components/healthImpact/VulnerablePopulations';
import ZoneWiseImpact from '../components/healthImpact/ZoneWiseImpact';
import DiseaseBreakdown from '../components/healthImpact/DiseaseBreakdown';
import Button from '../components/common/Button';

const HealthImpact = () => {
  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <span>🏥</span>
            <span>Health Impact Analysis</span>
          </h1>
          <p className="text-slate-600 mt-1">Monitor air quality effects on public health</p>
        </div>
      </div>

      {/* Health Metrics */}
      <HealthMetrics />

      {/* Correlation Chart */}
      <CorrelationChart />

      {/* Vulnerable Populations and Zone Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerablePopulations />
        <ZoneWiseImpact />
      </div>

      {/* Disease Breakdown */}
      <DiseaseBreakdown />

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button variant="primary" icon="📋">
          Generate Health Report
        </Button>
        <Button variant="secondary" icon="📢">
          Issue Health Advisory
        </Button>
        <Button variant="secondary" icon="📈">
          View Trends
        </Button>
      </div>
    </div>
  );
};

export default HealthImpact;