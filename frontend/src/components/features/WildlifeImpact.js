import React from 'react';
import { motion } from 'framer-motion';
import { Bird, Bug, AlertCircle, TrendingDown, TrendingUp, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getWildlifeData } from '../../utils/mockData';
import Card from '../common/Card';

const WildlifeImpact = () => {
  const data = getWildlifeData();

  const iconMap = {
    Bird: Bird,
    Bug: Bug,
    Squirrel: Heart,
  };

  const getTrendIcon = (trend) => {
    return trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : null;
  };

  const pieData = data.species.map(s => ({
    name: s.name,
    value: s.health,
    color: s.color
  }));

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Bird className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold gradient-text">Wildlife Health Index</h2>
              <p className="text-sm text-slate-600 mt-1">Impact of air quality on local species</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-orange-500">{data.overallHealth}%</div>
            <div className="text-xs text-slate-600 mt-1">Overall Health</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Species Cards */}
          <div className="space-y-3">
            {data.species.map((species, idx) => {
              const Icon = iconMap[species.icon] || Bird;
              const TrendIcon = getTrendIcon(species.trend);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-white/80 to-white/40 backdrop-blur-sm border border-white/50 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{species.name}</h4>
                        <p className="text-xs text-slate-500">{species.population}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {TrendIcon && <TrendIcon className={`w-4 h-4 ${species.trend === 'improving' ? 'text-green-600' : 'text-red-600'}`} />}
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: species.color }}>
                        {species.risk}
                      </span>
                    </div>
                  </div>
                  {/* Health Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Health Score</span>
                      <span className="font-semibold">{species.health}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${species.health}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: species.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Impact Details */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
          Key Environmental Impacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.impacts.map((impact, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">{impact}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Conservation Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 border border-green-200"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-green-100">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Help Protect Wildlife</h3>
            <p className="text-sm text-green-800 mb-4">
              Improving air quality directly benefits local wildlife populations. Every action counts - from reducing vehicle emissions to planting native trees.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Plant Native Trees
              </span>
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Reduce Emissions
              </span>
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                Create Green Spaces
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WildlifeImpact;