import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, MapPin, AlertCircle } from 'lucide-react';
import AQIPanel from '../components/dashboard/AQIPanel';
import CleanAirScore from '../components/dashboard/CleanAirScore';
import HealthRiskPrediction from '../components/dashboard/HealthRiskPrediction';
import BestTimeChart from '../components/dashboard/BestTimeChart';
import ShockPredictor from '../components/dashboard/ShockPredictor';
import Button from '../components/common/Button';

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get selected city from localStorage
    const cityData = localStorage.getItem('selectedCity');
    if (cityData) {
      setSelectedCity(JSON.parse(cityData));
    } else {
      // If no city selected, redirect to city selector
      navigate('/citizen/city-selector');
    }
  }, [navigate]);

  const handleChangeCity = () => {
    navigate('/citizen/city-selector');
  };

  if (!selectedCity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">Loading city data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header with City Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Air Quality Dashboard</h1>
            <div className="flex items-center mt-1 text-slate-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{selectedCity.name}, {selectedCity.state}</span>
            </div>
          </div>
        </div>
        <Button variant="secondary" onClick={handleChangeCity}>
          Change City
        </Button>
      </motion.div>

      {/* Main AQI Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AQIPanel />
      </motion.div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CleanAirScore />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <HealthRiskPrediction />
        </motion.div>
      </div>

      {/* Best Time Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <BestTimeChart />
      </motion.div>

      {/* Shock Predictor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ShockPredictor />
      </motion.div>
    </div>
  );
};

export default Dashboard;