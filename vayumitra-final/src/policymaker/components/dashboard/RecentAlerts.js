import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { useCity } from '../../../context/CityContext';

const RecentAlerts = () => {
  const { city } = useCity();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch real sensor data
        const res = await fetch(`/api/policymaker/sensors?city=${city}`);
        if (res.ok) {
          const sensors = await res.json();

          // Generate alerts based on sensor readings
          const generatedAlerts = [];
          let alertId = 1;

          sensors.forEach(sensor => {
            // severe > 400
            if (sensor.aqi > 400) {
              generatedAlerts.push({
                id: alertId++,
                title: `Critical AQI at ${sensor.location}`,
                description: `Severe pollution detected: ${sensor.aqi} AQI`,
                time: 'Just now',
                zone: sensor.location,
                severity: 'severe'
              });
            }
            // Very Poor > 300
            else if (sensor.aqi > 300) {
              generatedAlerts.push({
                id: alertId++,
                title: `Very Poor AQI at ${sensor.location}`,
                description: `Hazardous air quality: ${sensor.aqi} AQI`,
                time: '15 min ago',
                zone: sensor.location,
                severity: 'high'
              });
            }
            // Poor > 200 (Common for Pune now after calibration)
            else if (sensor.aqi > 200) {
              generatedAlerts.push({
                id: alertId++,
                title: `Poor AQI at ${sensor.location}`,
                description: `Unhealthy for sensitive groups: ${sensor.aqi} AQI`,
                time: '30 min ago',
                zone: sensor.location,
                severity: 'medium'
              });
            }
            // Moderate > 100 (Warning level)
            else if (sensor.aqi > 100) {
              generatedAlerts.push({
                id: alertId++,
                title: `Moderate AQI at ${sensor.location}`,
                description: `Air quality is acceptable but moderate: ${sensor.aqi} AQI`,
                time: '1 hour ago',
                zone: sensor.location,
                severity: 'low'
              });
            }
            // Specific Pollutant Alerts
            else if (sensor.pm25 > 60) {
              generatedAlerts.push({
                id: alertId++,
                title: `Elevated PM2.5`,
                description: `PM2.5 levels are rising: ${sensor.pm25} µg/m³`,
                time: '45 min ago',
                zone: sensor.location,
                severity: 'medium'
              });
            }
          });

          // Sort by severity
          const severityOrder = { severe: 0, high: 1, medium: 2, low: 3 };
          generatedAlerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

          setAlerts(generatedAlerts);
        }
      } catch (error) {
        console.error('Error loading alerts:', error);
      }
    };
    loadData();

    // Refresh every 2 minutes
    const interval = setInterval(loadData, 120000);
    return () => clearInterval(interval);
  }, [city]);

  const getSeverityColor = (severity) => {
    const colors = {
      severe: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-orange-100 text-orange-700 border-orange-300',
      low: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[severity] || colors.medium;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      severe: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };
    return icons[severity] || '🟡';
  };

  if (!alerts.length) return <Card>No alerts currently</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🚨 Recent Alerts</h2>
      <div className="space-y-3">
        {alerts.slice(0, 4).map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2">
                <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                <div>
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <p className="text-xs mt-1 opacity-80">{alert.description}</p>
                  <p className="text-xs mt-1 opacity-60">{alert.time} • Zone {alert.zone}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/policymaker/forecast-warnings')}
        className="w-full mt-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-sm transition-colors"
      >
        View All Alerts →
      </button>
    </Card>
  );
};

export default RecentAlerts;