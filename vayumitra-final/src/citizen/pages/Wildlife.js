import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bird } from 'lucide-react';
import WildlifeImpact from '../components/features/WildlifeImpact';

const Wildlife = () => {
  const [city, setCity] = useState("Delhi");
  const cities = ["Delhi", "Pune"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20">
            <Bird className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Wildlife & Bird Impact</h1>
            <p className="text-slate-600 mt-1">Monitor pollution effects on local species</p>
          </div>
        </div>

        {/* City Selector */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${city === c
                ? "bg-green-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      <WildlifeImpact city={city} />
    </div>
  );
};

export default Wildlife;