import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const ActiveAlerts = ({ city }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch real sensor data for station-wise alerts
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
                aqi: sensor.aqi,
                title: `Critical AQI at ${sensor.location}`,
                description: `Severe pollution detected: ${sensor.aqi} AQI`,
                time: 'Just now',
                zone: sensor.location,
                severity: 'severe',
                actions: ['School advisories issued', 'Traffic restrictions']
              });
            }
            // Very Poor > 300
            else if (sensor.aqi > 300) {
              generatedAlerts.push({
                id: alertId++,
                aqi: sensor.aqi,
                title: `Very Poor AQI at ${sensor.location}`,
                description: `Hazardous air quality: ${sensor.aqi} AQI`,
                time: '15 min ago',
                zone: sensor.location,
                severity: 'high',
                actions: ['Limit outdoor activities', 'Wear masks']
              });
            }
            // Poor > 200
            else if (sensor.aqi > 200) {
              generatedAlerts.push({
                id: alertId++,
                aqi: sensor.aqi,
                title: `Poor AQI at ${sensor.location}`,
                description: `Unhealthy for sensitive groups: ${sensor.aqi} AQI`,
                time: '30 min ago',
                zone: sensor.location,
                severity: 'medium',
                actions: ['Sensitive groups indoors']
              });
            }
            // Moderate > 100
            else if (sensor.aqi > 100) {
              generatedAlerts.push({
                id: alertId++,
                aqi: sensor.aqi,
                title: `Moderate AQI at ${sensor.location}`,
                description: `Air quality is acceptable but moderate: ${sensor.aqi} AQI`,
                time: '1 hour ago',
                zone: sensor.location,
                severity: 'low',
                actions: ['Monitor air quality']
              });
            }
          });

          // Sort by AQI descending (High Priority)
          generatedAlerts.sort((a, b) => b.aqi - a.aqi);

          setAlerts(generatedAlerts);
        }
      } catch (error) {
        console.error("Error loading alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [city]);

  const getSeverityColor = (severity) => {
    const colors = {
      severe: 'bg-red-50 text-red-700 border-red-200',
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-orange-50 text-orange-700 border-orange-200',
      low: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[severity] || colors.medium;
  };

  const getSeverityIcon = (severity) => {
    const icons = { severe: '🔴', high: '🟠', medium: '🟡', low: '🟢' };
    return icons[severity] || '🟡';
  };

  if (loading) return <Card>Checking active alerts...</Card>;

  if (!alerts.length) return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🚨 Active Alerts</h2>
      <div className="p-4 bg-green-50 rounded-lg text-green-700 border border-green-200">
        No active severe weather or pollution alerts for {city}.
      </div>
    </Card>
  );

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🚨 Active Station Alerts</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
            <div className="flex items-start space-x-3">
              <span className="text-xl mt-1">{getSeverityIcon(alert.severity)}</span>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">{alert.title}</h3>
                <p className="text-xs mb-2 opacity-90">{alert.description}</p>
                <div className="flex gap-2">
                  {alert.actions && alert.actions.map(a => (
                    <span key={a} className="text-[10px] px-2 py-0.5 bg-white/50 rounded-full border border-black/10">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActiveAlerts;