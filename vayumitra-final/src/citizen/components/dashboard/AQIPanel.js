import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, TrendingUp, AlertCircle, Calendar, Sun, CloudRain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getAQILevel, getGradientForAQI } from '../../utils/helpers';

import { fetchCitizenAQI, fetchMLForecast } from '../../../api/services';
import Card from '../common/Card';

const AQIPanel = ({ city }) => {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('24h');

  useEffect(() => {
    const loadData = async () => {
      try {
        const cityName = city?.name || 'Delhi';
        const [aqiData, forecastList] = await Promise.all([
          fetchCitizenAQI(cityName), // Fetches real-time AQI for selected city
          fetchMLForecast(cityName).catch(err => {
            console.error("ML Forecast fetch failed", err);
            return null;
          })
        ]);

        let predictions;
        if (forecastList && Array.isArray(forecastList) && forecastList.length > 0) {
          predictions = processForecastData(forecastList, aqiData.aqi);
        } else {
          // Fallback to mock generation
          predictions = {
            hourly24: generate24HourPrediction(aqiData.aqi),
            daily3: generate3DayPrediction(aqiData.aqi),
            daily7: generate7DayPrediction(aqiData.aqi)
          };
        }

        const cityAQIData = {
          ...aqiData,
          lastUpdated: new Date(aqiData.lastUpdated).toLocaleString(),
          predictions
        };

        setData(cityAQIData);
      } catch (error) {
        console.error("Error loading AQI data:", error);
      }
    };
    loadData();
  }, [city]);

  const processForecastData = (forecastList, currentAQI) => {
    // 1. Hourly 24h
    const now = new Date();
    // Start of current hour (e.g. 9:21 -> 9:00)
    const currentHour = new Date(now);
    currentHour.setMinutes(0, 0, 0);

    // Filter out past hours
    const futureItems = forecastList.filter(item => new Date(item.datetime) >= currentHour);

    const rawHourly = [];

    // Future points from ML
    const futureMapped = futureItems.map(item => {
      const d = new Date(item.datetime);
      const hourStr = d.getHours();
      const displayHour = hourStr === 0 ? '12 AM' : hourStr < 12 ? `${hourStr} AM` : hourStr === 12 ? '12 PM' : `${hourStr - 12} PM`;
      return {
        time: displayHour,
        aqi: Math.round(item.predicted_aqi),
        hour: hourStr
      };
    });

    // Force strict alignment: Prepend "Now" point with exact current AQI
    rawHourly.push({
      time: 'Now',
      aqi: currentAQI,
      hour: currentHour.getHours()
    });

    // Append future points
    rawHourly.push(...futureMapped);

    // Limit to 24 points
    const hourly24 = rawHourly.slice(0, 24);

    // 2. Daily 3 Days (Sample every 6 hours approx or group)
    // The original mock had 4 slots per day: Morning, Afternoon, Evening, Night
    // We can map hours to these slots for the next 3 days
    const daily3 = [];
    const slots = {
      'Morning': [6, 7, 8, 9, 10, 11],
      'Afternoon': [12, 13, 14, 15, 16],
      'Evening': [17, 18, 19, 20, 21],
      'Night': [22, 23, 0, 1, 2, 3, 4, 5]
    };

    const daysProcessed = new Set();
    let dayCount = 0;

    // Group by date
    const byDate = {};
    forecastList.forEach(item => {
      const d = new Date(item.datetime);
      const dateKey = d.toDateString();
      if (!byDate[dateKey]) byDate[dateKey] = [];
      byDate[dateKey].push(item);
    });

    Object.keys(byDate).slice(0, 3).forEach((dateKey, idx) => {
      const items = byDate[dateKey];
      const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : 'Day 3';

      ['Morning', 'Afternoon', 'Evening', 'Night'].forEach(slot => {
        // Find items in this slot
        const slotItems = items.filter(i => {
          const h = new Date(i.datetime).getHours();
          return slots[slot].includes(h);
        });

        if (slotItems.length > 0) {
          const avgAQI = slotItems.reduce((acc, curr) => acc + curr.predicted_aqi, 0) / slotItems.length;
          daily3.push({
            time: `${dayName} ${slot}`,
            day: dayName,
            slot: slot,
            aqi: Math.round(avgAQI)
          });
        }
      });
    });

    // 3. Daily 7 Days (We only have 3 days from ML, we will extrapolate or mock the rest)
    const daily7 = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateKey = d.toDateString();
      const dayName = dayNames[d.getDay()];
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

      let dayAQI = currentAQI; // Default

      if (byDate[dateKey]) {
        // Use average of that day
        const dayItems = byDate[dateKey];
        dayAQI = dayItems.reduce((acc, curr) => acc + curr.predicted_aqi, 0) / dayItems.length;
      } else {
        // Extrapolate/Mock for days 4-7 based on last known or random variation
        // Just use a simple random var around current for now to keep it safe
        dayAQI = currentAQI * (0.8 + Math.random() * 0.4);
      }

      daily7.push({
        day: i === 0 ? 'Today' : dayName,
        date: dateStr,
        aqi: Math.round(dayAQI),
        temp: Math.round(28 + Math.random() * 6),
        condition: i % 3 === 0 ? 'Clear' : i % 3 === 1 ? 'Cloudy' : 'Rainy'
      });
    }

    return { hourly24, daily3, daily7 };
  };

  // Generate 24-hour prediction (hourly)
  const generate24HourPrediction = (baseAQI) => {
    const hours = [];
    const now = new Date();

    // Morning dip, peak during traffic hours
    const patterns = [
      0.85, 0.78, 0.72, 0.68, 0.67, 0.73, // 12am-6am
      0.95, 1.15, 1.32, 1.28, 1.20, 1.10, // 6am-12pm (morning peak)
      1.05, 0.95, 0.88, 0.85, 0.90, 1.05, // 12pm-6pm
      1.25, 1.35, 1.28, 1.15, 1.05, 0.95  // 6pm-12am (evening peak)
    ];

    for (let i = 0; i < 24; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hourStr = hour.getHours();
      const displayHour = hourStr === 0 ? '12 AM' : hourStr < 12 ? `${hourStr} AM` : hourStr === 12 ? '12 PM' : `${hourStr - 12} PM`;

      hours.push({
        time: displayHour,
        aqi: Math.round(baseAQI * patterns[i]),
        hour: hourStr
      });
    }

    return hours;
  };

  // Generate 3-day prediction (every 6 hours)
  const generate3DayPrediction = (baseAQI) => {
    const days = [];
    const dayNames = ['Today', 'Tomorrow', 'Day 3'];

    // Slight variation day by day
    const dayFactors = [1.0, 0.92, 0.88];

    dayNames.forEach((day, dayIdx) => {
      const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
      const patterns = [0.75, 0.95, 1.25, 1.05]; // Pattern within each day

      timeSlots.forEach((slot, slotIdx) => {
        days.push({
          time: `${day} ${slot}`,
          day: day,
          slot: slot,
          aqi: Math.round(baseAQI * patterns[slotIdx] * dayFactors[dayIdx])
        });
      });
    });

    return days;
  };

  // Generate 7-day prediction (daily average)
  const generate7DayPrediction = (baseAQI) => {
    const days = [];
    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Weekly pattern (weekends better, weekdays worse)
    const weekPatterns = [0.82, 0.98, 1.05, 1.08, 1.03, 0.95, 0.80];

    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = dayNames[date.getDay()];
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

      days.push({
        day: i === 0 ? 'Today' : dayName,
        date: dateStr,
        aqi: Math.round(baseAQI * weekPatterns[i]),
        temp: Math.round(28 + Math.random() * 6), // Mock temperature
        condition: i % 3 === 0 ? 'Clear' : i % 3 === 1 ? 'Cloudy' : 'Rainy'
      });
    }

    return days;
  };

  if (!data) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading AQI data...</p>
        </div>
      </Card>
    );
  }

  const { level, color } = getAQILevel(data.aqi);
  const gradient = getGradientForAQI(data.aqi);

  const tabs = [
    { id: '24h', label: 'Next 24 Hours', icon: Clock },
    { id: '3d', label: 'Next 3 Days', icon: Calendar },
    { id: '7d', label: 'Next 7 Days', icon: Sun }
  ];

  const getChartData = () => {
    switch (activeTab) {
      case '24h': return data.predictions.hourly24;
      case '3d': return data.predictions.daily3;
      case '7d': return data.predictions.daily7;
      default: return data.predictions.hourly24;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const { level: tooltipLevel } = getAQILevel(item.aqi);

      return (
        <div className="glass-card p-3 border border-white/50">
          <p className="text-sm font-semibold text-slate-800">
            {activeTab === '7d' ? `${item.day} (${item.date})` : item.time}
          </p>
          <p className="text-lg font-bold mt-1" style={{ color: getAQILevel(item.aqi).color }}>
            AQI: {item.aqi}
          </p>
          <p className="text-xs text-slate-600 mt-1">{tooltipLevel}</p>
          {activeTab === '7d' && item.condition && (
            <p className="text-xs text-slate-500 mt-1">
              {item.temp}°C • {item.condition}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <div className="space-y-6">
        {/* Current AQI Display - Modern Card Design */}
        <div className="relative overflow-hidden rounded-2xl p-8" style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          borderLeft: `6px solid ${color}`
        }}>
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
          }} />

          <div className="relative z-10">
            {/* Location Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <div className="flex items-center text-slate-700 mb-2">
                  <MapPin className="w-5 h-5 mr-2" style={{ color }} />
                  <span className="text-xl font-bold">{data.location}</span>
                </div>
                <div className="flex items-center text-slate-500 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Last updated: {data.lastUpdated}</span>
                </div>
              </div>

              {/* Status Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="mt-4 md:mt-0"
              >
                <div className="inline-flex items-center px-6 py-3 rounded-2xl text-white font-bold text-lg shadow-xl"
                  style={{ backgroundColor: color }}>
                  {level}
                </div>
              </motion.div>
            </div>

            {/* Main AQI Display */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Large AQI Number */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <div className="text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm shadow-2xl border-4"
                    style={{ borderColor: color }}>
                    <div className="text-4xl font-black text-blue-900" style={{ color }}>
                      {data.aqi}
                    </div>
                    <div className="text-sm font-bold text-slate-600 mt-2 uppercase tracking-wider">
                      Current AQI
                    </div>
                  </div>

                  {/* Floating indicator */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-3 -right-3 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: color }}
                  >
                    <TrendingUp className={`w-8 h-8 text-white ${data.predictions.hourly24[23].aqi > data.aqi ? '' : 'rotate-180'}`} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Today's Peak */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Today's Peak</div>
                      <div className="p-2 rounded-lg bg-blue-100">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-blue-900">
                      {Math.max(...data.predictions.hourly24.map(h => h.aqi))}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">Expected maximum</div>
                  </motion.div>

                  {/* Best Hour */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-green-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-green-700 uppercase tracking-wide">Best Hour</div>
                      <div className="p-2 rounded-lg bg-green-100">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-green-900">
                      {data.predictions.hourly24.reduce((min, h) => h.aqi < min.aqi ? h : min).time}
                    </div>
                    <div className="text-xs text-green-600 mt-1">Best time to go out</div>
                  </motion.div>

                  {/* Weekly Average */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-purple-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide">7-Day Avg</div>
                      <div className="p-2 rounded-lg bg-purple-100">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="text-4xl font-black text-purple-900">
                      {Math.round(data.predictions.daily7.reduce((sum, d) => sum + d.aqi, 0) / 7)}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">Weekly forecast</div>
                  </motion.div>
                </div>

                {/* Health Advisory Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300"
                >
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-amber-200 mr-3">
                      <AlertCircle className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-amber-900 mb-1">Health Advisory</h4>
                      <p className="text-sm text-amber-800">
                        {data.aqi > 150 ? 'Avoid outdoor activities. Use N95 masks if going out.' :
                          data.aqi > 100 ? 'Sensitive groups should limit outdoor exposure.' :
                            data.aqi > 50 ? 'Air quality is acceptable for most people.' :
                              'Air quality is good. Enjoy outdoor activities!'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Tabs */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">AQI Forecast</h3>
            <div className="flex space-x-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow'
                      : 'bg-white/60 text-slate-700 border border-slate-200 hover:border-indigo-300'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.id.toUpperCase()}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Prediction Chart */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="aqiAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey={activeTab === '7d' ? 'day' : 'time'}
                  stroke="#64748b"
                  style={{ fontSize: '11px' }}
                  angle={activeTab === '24h' ? -45 : 0}
                  textAnchor={activeTab === '24h' ? 'end' : 'middle'}
                  height={activeTab === '24h' ? 80 : 50}
                />
                <YAxis
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  label={{ value: 'AQI', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#aqiAreaGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* 7-Day Weather Icons */}
            {activeTab === '7d' && (
              <div className="grid grid-cols-7 gap-2 mt-4">
                {data.predictions.daily7.map((day, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center p-2 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="text-xs font-semibold text-slate-700 mb-1">{day.day}</div>
                    {day.condition === 'Clear' ? (
                      <Sun className="w-5 h-5 text-yellow-500 mx-auto" />
                    ) : day.condition === 'Rainy' ? (
                      <CloudRain className="w-5 h-5 text-blue-500 mx-auto" />
                    ) : (
                      <Calendar className="w-5 h-5 text-slate-500 mx-auto" />
                    )}
                    <div className="text-xs text-slate-500 mt-1">{day.temp}°C</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Card>
  );
};

export default AQIPanel;