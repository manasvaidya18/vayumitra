import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Trees, Bus, Wind, Home, Users, CheckCircle2, IndianRupee, Clock, MapPin } from 'lucide-react';
import { getGreenSuggestions } from '../../utils/mockData';
import Card from '../common/Card';

const GreenSuggestions = () => {
  const [selectedCity, setSelectedCity] = useState('Delhi, Delhi');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setSuggestions(getGreenSuggestions(selectedCity));
  }, [selectedCity]);

  const cities = [
    { name: 'Pimpri, Maharashtra', coords: [18.6298, 73.7997] },
    { name: 'Mumbai, Maharashtra', coords: [19.0760, 72.8777] },
    { name: 'Pune, Maharashtra', coords: [18.5204, 73.8567] },
    { name: 'Delhi, Delhi', coords: [28.7041, 77.1025] },
    { name: 'Bangalore, Karnataka', coords: [12.9716, 77.5946] },
    { name: 'Hyderabad, Telangana', coords: [17.3850, 78.4867] }
  ];

  const iconMap = {
    Trees: Trees,
    Bus: Bus,
    Wind: Wind,
    Home: Home,
    Users: Users,
  };

  const categories = ['All', 'Plantation', 'Transport', 'Indoor', 'Infrastructure'];

  const filteredSuggestions = selectedCategory === 'All'
    ? suggestions
    : suggestions.filter(s => s.category === selectedCategory);

  const getCostColor = (cost) => {
    switch (cost) {
      case 'Very Low': return 'text-green-600 bg-green-100';
      case 'Low': return 'text-blue-600 bg-blue-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold gradient-text">AI-Powered Green Suggestions</h2>
              <p className="text-sm text-slate-600 mt-1">Personalized recommendations for {selectedCity}</p>
            </div>
          </div>

          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-700 min-w-[200px]"
            >
              {cities.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-600 pointer-events-none" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${selectedCategory === cat
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow'
                : 'bg-white/60 text-slate-700 border border-slate-200 hover:border-indigo-300'
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuggestions.map((suggestion, idx) => {
          const Icon = iconMap[suggestion.icon] || Lightbulb;
          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card hover={true}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold gradient-text">{suggestion.impact}%</div>
                    <div className="text-xs text-slate-600">Impact Score</div>
                  </div>
                </div>

                {/* Title & Category */}
                <h3 className="text-lg font-bold text-slate-800 mb-2">{suggestion.title}</h3>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
                  {suggestion.category}
                </span>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4">{suggestion.description}</p>

                {/* Impact Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Environmental Impact</span>
                    <span className="font-semibold">{suggestion.impact}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${suggestion.impact}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-slate-600 mb-4">
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    <span className={`px-2 py-1 rounded-full font-semibold ${getCostColor(suggestion.cost)}`}>
                      {suggestion.cost}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-medium">{suggestion.timeframe}</span>
                  </div>
                </div>

                {/* Action Button */}
                {/* {suggestion.actionable && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Take Action
                  </motion.button>
                )} */}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Impact Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Combined Impact Potential</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-center"
          >
            <div className="text-3xl font-bold text-green-600">-35%</div>
            <div className="text-sm text-slate-600 mt-1">PM2.5 Reduction</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 text-center"
          >
            <div className="text-3xl font-bold text-blue-600">-28%</div>
            <div className="text-sm text-slate-600 mt-1">CO₂ Emissions</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 text-center"
          >
            <div className="text-3xl font-bold text-purple-600">+42%</div>
            <div className="text-sm text-slate-600 mt-1">Air Quality Score</div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};

export default GreenSuggestions;