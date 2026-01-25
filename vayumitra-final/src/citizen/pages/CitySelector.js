import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, TrendingUp, TrendingDown, Wind, Navigation, CheckCircle2 } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const CitySelector = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    { 
      id: 1, 
      name: 'Pimpri', 
      state: 'Maharashtra', 
      aqi: 87, 
      trend: 'down', 
      level: 'Moderate',
      color: '#f59e0b',
      population: '1.7M',
      coordinates: '18.6298° N, 73.7997° E'
    },
    { 
      id: 2, 
      name: 'Mumbai', 
      state: 'Maharashtra', 
      aqi: 142, 
      trend: 'up', 
      level: 'Unhealthy',
      color: '#ef4444',
      population: '12.5M',
      coordinates: '19.0760° N, 72.8777° E'
    },
    { 
      id: 3, 
      name: 'Pune', 
      state: 'Maharashtra', 
      aqi: 95, 
      trend: 'down', 
      level: 'Moderate',
      color: '#f59e0b',
      population: '3.1M',
      coordinates: '18.5204° N, 73.8567° E'
    },
    { 
      id: 4, 
      name: 'Delhi', 
      state: 'Delhi', 
      aqi: 178, 
      trend: 'up', 
      level: 'Unhealthy',
      color: '#dc2626',
      population: '16.8M',
      coordinates: '28.7041° N, 77.1025° E'
    },
    { 
      id: 5, 
      name: 'Bangalore', 
      state: 'Karnataka', 
      aqi: 68, 
      trend: 'down', 
      level: 'Moderate',
      color: '#f59e0b',
      population: '8.4M',
      coordinates: '12.9716° N, 77.5946° E'
    },
    { 
      id: 6, 
      name: 'Hyderabad', 
      state: 'Telangana', 
      aqi: 82, 
      trend: 'up', 
      level: 'Moderate',
      color: '#f59e0b',
      population: '6.8M',
      coordinates: '17.3850° N, 78.4867° E'
    },
    { 
      id: 7, 
      name: 'Chennai', 
      state: 'Tamil Nadu', 
      aqi: 72, 
      trend: 'down', 
      level: 'Moderate',
      color: '#f59e0b',
      population: '7.1M',
      coordinates: '13.0827° N, 80.2707° E'
    },
    { 
      id: 8, 
      name: 'Kolkata', 
      state: 'West Bengal', 
      aqi: 125, 
      trend: 'up', 
      level: 'Unhealthy',
      color: '#f97316',
      population: '4.5M',
      coordinates: '22.5726° N, 88.3639° E'
    },
    { 
      id: 9, 
      name: 'Ahmedabad', 
      state: 'Gujarat', 
      aqi: 98, 
      trend: 'down', 
      level: 'Moderate',
      color: '#f59e0b',
      population: '5.6M',
      coordinates: '23.0225° N, 72.5714° E'
    },
  ];

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleContinue = () => {
    if (selectedCity) {
      // Store selected city in localStorage or state management
      localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
      navigate('/citizen/dashboard');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 mb-6"
        >
          <MapPin className="w-8 h-8 text-indigo-600" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Select Your City</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Choose your location to get personalized air quality data and insights
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your city..."
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-lg"
            />
          </div>
        </Card>
      </motion.div>

      {/* Selected City Banner */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-green-100">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-green-900">Selected City</h3>
                    <p className="text-green-700">{selectedCity.name}, {selectedCity.state}</p>
                  </div>
                </div>
                <Button onClick={handleContinue} icon={Navigation}>
                  Continue to Dashboard
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city, idx) => {
          const TrendIcon = city.trend === 'up' ? TrendingUp : TrendingDown;
          const isSelected = selectedCity?.id === city.id;

          return (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCitySelect(city)}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-4 ring-indigo-400' : ''
                }`}
              >
                <Card hover={true} className={isSelected ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : ''}>
                  {/* City Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{city.name}</h3>
                        <p className="text-sm text-slate-500">{city.state}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="p-1 rounded-full bg-indigo-500"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* AQI Display */}
                  <div className="mb-4">
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Current AQI</p>
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold" style={{ color: city.color }}>
                            {city.aqi}
                          </span>
                          <div className={`ml-2 flex items-center ${
                            city.trend === 'up' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            <TrendIcon className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: city.color }}
                        >
                          {city.level}
                        </span>
                      </div>
                    </div>

                    {/* AQI Progress Bar */}
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(city.aqi / 200) * 100}%` }}
                        transition={{ duration: 1, delay: idx * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: city.color }}
                      />
                    </div>
                  </div>

                  {/* City Details */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Population</span>
                      <span className="font-semibold text-slate-700">{city.population}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Coordinates</span>
                      <span className="font-semibold text-slate-700">{city.coordinates}</span>
                    </div>
                  </div>

                  {/* Select Indicator */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-4 py-2 px-4 rounded-lg text-center text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: isSelected ? '#4f46e5' : '#e0e7ff',
                      color: isSelected ? 'white' : '#4f46e5'
                    }}
                  >
                    {isSelected ? 'Selected ✓' : 'Select City'}
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredCities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Wind className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No cities found</h3>
          <p className="text-slate-500">Try searching with a different keyword</p>
        </motion.div>
      )}

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Wind className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Can't find your city?</h4>
              <p className="text-xs text-blue-700">
                We're constantly expanding our coverage. Contact us to request your city be added to our monitoring network.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CitySelector;