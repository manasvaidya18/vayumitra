import React from 'react';
import ForecastCards from '../components/forecast/ForecastCards';
import ForecastChart from '../components/forecast/ForecastChart';
import ActiveAlerts from '../components/forecast/ActiveAlerts';
import AlertConfiguration from '../components/forecast/AlertConfiguration';
import WeatherCorrelation from '../components/forecast/WeatherCorrelation';

const ForecastWarnings = () => {
  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <span>🔮</span>
          <span>Forecast & Early Warning System</span>
        </h1>
        <p className="text-slate-600 mt-1">Predict and prepare for air quality changes</p>
      </div>

      {/* Forecast Cards */}
      <ForecastCards />

      {/* Forecast Chart */}
      <ForecastChart />

      {/* Active Alerts and Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveAlerts />
        <AlertConfiguration />
      </div>

      {/* Weather Correlation */}
      <WeatherCorrelation />
    </div>
  );
};

export default ForecastWarnings;