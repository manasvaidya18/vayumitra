import React from 'react';
import { motion } from 'framer-motion';
import { Bird } from 'lucide-react';
import WildlifeImpact from '../components/features/WildlifeImpact';

const Wildlife = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 mb-8"
      >
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20">
          <Bird className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Wildlife & Bird Impact</h1>
          <p className="text-slate-600 mt-1">Monitor pollution effects on local species</p>
        </div>
      </motion.div>

      <WildlifeImpact />
    </div>
  );
};

export default Wildlife;