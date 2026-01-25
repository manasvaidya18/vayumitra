import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, subtitle, icon, trend, trendDirection, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600'
  };

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">{value}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
          {trend && (
            <div className={`mt-2 flex items-center space-x-1 text-sm ${
              trendDirection === 'up' ? 'text-red-600' : 'text-green-600'
            }`}>
              <span>{trendDirection === 'up' ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;