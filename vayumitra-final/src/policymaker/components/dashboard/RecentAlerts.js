import React from 'react';
import Card from '../common/Card';
import { mockAlerts } from '../../data/mockData';

const RecentAlerts = () => {
  const getSeverityColor = (severity) => {
    const colors = {
      severe: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300'
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

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🚨 Recent Alerts</h2>
      <div className="space-y-3">
        {mockAlerts.slice(0, 4).map((alert) => (
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
      <button className="w-full mt-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-sm transition-colors">
        View All Alerts →
      </button>
    </Card>
  );
};

export default RecentAlerts;