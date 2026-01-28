import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, Leaf, Wind, TrendingDown, Droplets, MapPin, Sparkles, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Card from '../components/common/Card';
import InteractiveLeafletMap from '../components/features/InteractiveLeafletMap';
import { fetchCitizenAQI } from '../../api/services';

const TreeImpact = () => {
  const [treeType, setTreeType] = useState('Neem');
  const [duration, setDuration] = useState('1 year');
  const [location, setLocation] = useState('Pimpri, Maharashtra');
  const [plantedTrees, setPlantedTrees] = useState([]);
  const [stats, setStats] = useState({});
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentAQI, setCurrentAQI] = useState(100);

  // New state to track removal
  const handleTreeRemove = (treeId) => {
    setPlantedTrees(prev => prev.filter(t => t.id !== treeId));
  };

  useEffect(() => {
    const getAQI = async () => {
      try {
        const data = await fetchCitizenAQI();
        if (data && data.aqi) {
          setCurrentAQI(data.aqi);
        }
      } catch (error) {
        console.error("Failed to fetch AQI", error);
      }
    };
    getAQI();
  }, []);

  const treeTypes = [
    { name: 'Banyan', co2: 300, pm25: 0.25, o2: 400, emoji: '🌳', desc: 'Keystone species, massive carbon sink (approx. 300kg/yr).' },
    { name: 'Neem', co2: 45, pm25: 0.18, o2: 130, emoji: '🌲', desc: 'Natural air purifier, high efficiency.' },
    { name: 'Peepal', co2: 50, pm25: 0.20, o2: 140, emoji: '🌴', desc: 'Releases oxygen at night (CAM photosynthesis).' },
    { name: 'Bamboo', co2: 80, pm25: 0.12, o2: 250, emoji: '🎍', desc: 'Fastest biomass growth, high annual sequestration.' },
    { name: 'Ashoka', co2: 25, pm25: 0.12, o2: 90, emoji: '🎋', desc: 'Effective noise barrier, moderate absorption.' },
    { name: 'Jamun', co2: 30, pm25: 0.15, o2: 100, emoji: '🍒', desc: 'Dense foliage traps particulates effectively.' },
    { name: 'Teak', co2: 35, pm25: 0.14, o2: 110, emoji: '🪵', desc: 'Valuable timber, sequester carbon in dense wood.' },
    { name: 'Gulmohar', co2: 30, pm25: 0.15, o2: 100, emoji: '🌺', desc: 'Wide decorative canopy, good shade.' }
  ];

  const durations = {
    '1 year': 12,
    '5 years': 60,
    '10 years': 120,
    '20 years': 240,
    '30 years': 360
  };

  const cities = [
    { name: 'Pimpri, Maharashtra', coords: [18.6298, 73.7997], radius: 25 },
    { name: 'Mumbai, Maharashtra', coords: [19.0760, 72.8777], radius: 30 },
    { name: 'Pune, Maharashtra', coords: [18.5204, 73.8567], radius: 25 },
    { name: 'Delhi, Delhi', coords: [28.7041, 77.1025], radius: 35 },
    { name: 'Bangalore, Karnataka', coords: [12.9716, 77.5946], radius: 25 },
    { name: 'Hyderabad, Telangana', coords: [17.3850, 78.4867], radius: 30 }
  ];

  // Calculate stats whenever inputs change
  useEffect(() => {
    calculateStats();
  }, [treeType, duration, plantedTrees, location]);

  const calculateStats = () => {
    const tree = treeTypes.find(t => t.name === treeType);
    const months = durations[duration];

    // Filter trees by current location only
    const localTrees = plantedTrees.filter(t => t.location === location);
    const totalTrees = localTrees.length;

    // Realistic Impact Formulas with Calibration
    // Maturity factor: Linear growth until 10 years (120 months)
    const maturityCapC02 = 120; // 10 years to full CO2 maturity
    const avgMaturity = Math.max(0.2, Math.min(1, months / maturityCapC02));

    // CO2: Absorbed = (Rate * Count * Years * AvgMaturity)
    const co2Absorbed = Math.round(tree.co2 * totalTrees * (months / 12) * avgMaturity);

    // PM2.5 Reduction:
    // Factor: (PM2.5_Rate * Count * Maturity) / DampingFactor (Local impact)
    const pm25Base = (tree.pm25 * totalTrees * avgMaturity) / 6;
    const pm25Reduction = Math.min(30, pm25Base).toFixed(2); // Cap at 30%

    // AQI Improvement: 
    // IND-AQI slope in Moderate/Poor zones is ~3.3 (1 µg/m3 drop ≈ 3.3 AQI points)
    // We use 3.0 as a conservative realistic multiplier.
    const aqiImprovement = Math.round(pm25Reduction * 3.0);

    const oxygenRelease = Math.round(tree.o2 * totalTrees);

    setStats({
      co2Absorbed,
      pm25Reduction,
      aqiImprovement,
      oxygenRelease,
      totalTrees
    });
  };

  const handleTreesPlanted = (newTrees) => {
    // Each click plants 5 trees with the current tree type
    const treesToAdd = newTrees.map(tree => ({
      ...tree,
      type: treeType,
      timestamp: new Date(),
      location: location // Ensure location is set explicitly (redundant but safe)
    }));

    setPlantedTrees(prev => [...prev, ...treesToAdd]);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const generateChartData = () => {
    const tree = treeTypes.find(t => t.name === treeType);
    const months = durations[duration];
    const data = [];

    // Determine step size (yearly for > 1 year, monthly for 1 year)
    const totalYears = months / 12;
    const isMultiYear = totalYears >= 2;
    const stepCount = isMultiYear ? totalYears : months;

    const totalTrees = plantedTrees.filter(t => t.location === location).length;

    for (let i = 0; i <= stepCount; i++) {
      const currentLabelVal = isMultiYear ? i : i;
      const currentLabelUnit = isMultiYear ? 'Y' : 'M';
      let label = i === 0 ? 'Now' : `${currentLabelVal}${currentLabelUnit}`;

      // Calculate growth at this step
      const currentMonths = isMultiYear ? i * 12 : i;

      // Maturity curve up to 10 years (120 months)
      const stepMaturity = Math.max(0.1, Math.min(1, currentMonths / 120));

      // Dynamic PM2.5 reduction at this point in time
      const currentPMReduct = (tree.pm25 * totalTrees * stepMaturity) / 6;

      // Dynamic CO2 accumulation up to this point
      const timeInYears = currentMonths / 12;
      // Use average maturity over the period for accumulation
      const avgEpochMaturity = Math.max(0.1, Math.min(1, (currentMonths / 2) / 120));
      const currentCO2 = Math.round(tree.co2 * totalTrees * timeInYears * avgEpochMaturity);

      data.push({
        month: label,
        aqi: Math.max(50, currentAQI - (currentPMReduct * 3.0)),
        co2: currentCO2
      });
    }

    return data;
  };

  const getAISuggestion = () => {
    const tree = treeTypes.find(t => t.name === treeType);
    const totalTrees = plantedTrees.filter(t => t.location === location).length;

    // Recalculate PM2.5 for suggestion text
    const months = durations[duration];
    const maturityFactor = Math.min(1, months / 60); // 5y maturity cap
    const pm25 = ((tree.pm25 * totalTrees * maturityFactor) / 6).toFixed(2);
    const cityName = location.split(',')[0];

    if (totalTrees === 0) {
      return `Click on the map to start planting ${treeType} trees in ${cityName}. Each click plants 5 trees! 🌱`;
    } else if (totalTrees < 20) {
      return `Good start! ${totalTrees} ${treeType} trees in ${cityName} can reduce local PM2.5 by ${pm25}% over ${duration}. Plant more for visible impact.`;
    } else if (totalTrees < 100) {
      return `Growing green! ${totalTrees} ${treeType} trees provide cleaner air for the neighborhood, reducing PM2.5 by ${pm25}%.`;
    } else {
      return `Long-term vision! ${totalTrees} ${treeType} trees in ${cityName} will remove massive CO₂ and drop PM2.5 by ${pm25}% over ${duration}.`;
    }
  };

  const getCurrentCity = () => {
    return cities.find(c => c.name === location) || cities[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 mb-4">
          <Trees className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Interactive Tree Impact Simulator</h1>
        <p className="text-lg text-slate-600">Click on the map to plant trees 🌱</p>
      </motion.div>

      {/* Success Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="glass-card p-6 bg-green-500/90 border-2 border-green-400 shadow-glow">
              <div className="flex items-center space-x-3 text-white">
                <Trees className="w-6 h-6" />
                <span className="font-bold">5 {treeType} Trees Planted! 🌱</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Input Controls Card */}
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
              Planting Configuration
            </h3>

            <div className="space-y-6">
              {/* Tree Type Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tree Type
                </label>
                <div className="relative">
                  <select
                    value={treeType}
                    onChange={(e) => setTreeType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-700"
                  >
                    {treeTypes.map(tree => (
                      <option key={tree.name} value={tree.name}>
                        {tree.emoji} {tree.name}
                      </option>
                    ))}
                  </select>
                  <Trees className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600 pointer-events-none" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Selected: {treeTypes.find(t => t.name === treeType)?.emoji} {treeType}
                </p>
              </div>

              {/* Duration Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Time Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(durations).map(dur => (
                    <motion.button
                      key={dur}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDuration(dur)}
                      className={`py-3 px-2 rounded-xl font-semibold text-sm transition-all ${duration === dur
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-glow'
                        : 'bg-white/60 text-slate-700 border-2 border-slate-200 hover:border-green-300'
                        }`}
                    >
                      {dur}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Location Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border-2 border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none cursor-pointer font-semibold text-slate-700"
                  >
                    {cities.map(city => (
                      <option key={city.name} value={city.name}>
                        📍 {city.name}
                      </option>
                    ))}
                  </select>
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-600 pointer-events-none" />
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900 mb-1">How to Plant</h4>
                    <p className="text-xs text-blue-800">
                      Click anywhere on the map to plant 5 trees at that location. Watch the ripple effect and tree animations!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Live Stats */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Live Impact Stats
            </h3>

            <div className="space-y-4">
              <StatItem
                icon={Wind}
                label="CO₂ Absorbed"
                value={stats.co2Absorbed || 0}
                unit="kg"
                color="blue"
              />
              <StatItem
                icon={Leaf}
                label="PM2.5 Reduction"
                value={stats.pm25Reduction || 0}
                unit="%"
                color="green"
              />
              <StatItem
                icon={TrendingDown}
                label="AQI Improvement"
                value={stats.aqiImprovement || 0}
                unit="points"
                color="purple"
              />
              <StatItem
                icon={Droplets}
                label="O₂ Release"
                value={stats.oxygenRelease || 0}
                unit="L/day"
                color="cyan"
              />
            </div>

            <div className="mt-4 pt-4 border-t-2 border-green-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-800">Total Trees</span>
                <motion.span
                  key={stats.totalTrees}
                  initial={{ scale: 1.5, color: '#10b981' }}
                  animate={{ scale: 1, color: '#047857' }}
                  className="text-2xl font-black"
                >
                  {stats.totalTrees || 0}
                </motion.span>
              </div>
              <div className="text-xs text-green-700 text-center mt-2">
                (Each click = 5 trees)
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right Panel - Map & Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Interactive Leaflet Map */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                Interactive Planting Map
              </h3>
              <div className="flex items-center space-x-2 text-sm font-semibold text-green-600">
                <Trees className="w-4 h-4" />
                <span>Click to plant 5 trees</span>
              </div>
            </div>

            <InteractiveLeafletMap
              city={getCurrentCity()}
              treeType={treeType}
              plantedTrees={plantedTrees.filter(t => t.location === location)}
              onTreesPlanted={handleTreesPlanted}
              onTreeRemove={handleTreeRemove}
            />
          </Card>

          {/* Impact Chart */}
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-green-600" />
              Projected Environmental Impact
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateChartData()}>
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#10b981" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="aqi"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#aqiGradient)"
                  name="AQI Level"
                  dot={{ fill: '#10b981', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="co2"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#co2Gradient)"
                  name="CO₂ Absorbed (kg)"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-indigo-100">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-indigo-900 mb-2">AI Recommendation</h4>
                <motion.p
                  key={`${stats.totalTrees}-${treeType}-${duration}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-indigo-800"
                >
                  {getAISuggestion()}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Stat Item Component
const StatItem = ({ icon: Icon, label, value, unit, color }) => {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    cyan: 'from-cyan-500 to-blue-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-between p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-green-200 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[color]}/20`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <motion.div
        key={value}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="text-right"
      >
        <div className={`text-2xl font-black bg-gradient-to-r ${colors[color]} bg-clip-text text-transparent`}>
          {value}
        </div>
        <div className="text-xs text-slate-500">{unit}</div>
      </motion.div>
    </motion.div>
  );
};

export default TreeImpact;