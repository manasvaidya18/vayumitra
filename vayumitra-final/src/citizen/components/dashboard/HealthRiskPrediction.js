import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertTriangle, CheckCircle2, User } from 'lucide-react';
import { fetchCitizenHealthRisk } from '../../../api/services';
import Card from '../common/Card';
import Button from '../common/Button';

const HealthRiskPrediction = () => {
  const [age, setAge] = useState(35);
  const [conditions, setConditions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [riskData, setRiskData] = useState(null);

  const healthConditions = [
    'Asthma',
    'Heart Disease',
    'Diabetes',
    'COPD',
    'Allergies'
  ];

  const handleCalculate = async () => {
    try {
      const data = await fetchCitizenHealthRisk(age, conditions);
      setRiskData(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error calculating health risk", error);
    }
  };

  const toggleCondition = (condition) => {
    setConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <Card>
      <div className="flex items-center mb-6">
        <Heart className="w-6 h-6 text-red-500 mr-3" />
        <h2 className="text-2xl font-bold gradient-text">Personal Health Risk</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Age Input */}
          <div>
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-3">
              <User className="w-4 h-4 mr-2" />
              Your Age: <span className="ml-2 text-indigo-600">{age} years</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${age}%, #e0e7ff ${age}%, #e0e7ff 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>1</span>
              <span>100</span>
            </div>
          </div>

          {/* Health Conditions */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-3 block">
              Pre-existing Conditions
            </label>
            <div className="space-y-2">
              {healthConditions.map((condition) => (
                <motion.button
                  key={condition}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleCondition(condition)}
                  className={`w-full p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${conditions.includes(condition)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-transparent text-white shadow-glow'
                      : 'bg-white/60 border-slate-200 text-slate-700 hover:border-indigo-300'
                    }`}
                >
                  <span className="font-medium">{condition}</span>
                  {conditions.includes(condition) && <CheckCircle2 className="w-5 h-5" />}
                </motion.button>
              ))}
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Calculate Risk
          </Button>
        </div>

        {/* Results Display */}
        <div>
          {showResults && riskData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Risk Meter */}
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-48 h-48">
                    <defs>
                      <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#e2e8f0"
                      strokeWidth="16"
                      fill="none"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#riskGradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 502' }}
                      animate={{ strokeDasharray: `${(riskData.risk / 100) * 502} 502` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      transform="rotate(-90 96 96)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-bold" style={{ color: riskData.color }}>
                      {riskData.risk}%
                    </div>
                    <div className="text-sm text-slate-600 mt-1">Risk Level</div>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-white font-semibold text-sm"
                  style={{ backgroundColor: riskData.color }}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {riskData.level} Risk
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {riskData.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 + 0.5 }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-700">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Enter your details to calculate health risk</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HealthRiskPrediction;