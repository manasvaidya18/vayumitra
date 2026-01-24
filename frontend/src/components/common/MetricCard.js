import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ icon: Icon, title, value, unit, color = 'indigo', trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="metric-card group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-${color}-400/20 to-${color}-600/20 group-hover:shadow-glow transition-shadow`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend === 'up' ? '↑' : '↓'}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-slate-600 font-medium">{title}</p>
        <div className="flex items-baseline mt-1">
          <h3 className={`text-3xl font-bold gradient-text`}>{value}</h3>
          {unit && <span className="ml-2 text-sm text-slate-500">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;