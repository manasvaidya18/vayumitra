import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import GreenSuggestions from '../components/features/GreenSuggestions';

const GreenSuggestionsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 mb-8"
      >
        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">Green Suggestions</h1>
          <p className="text-slate-600 mt-1">AI-powered recommendations for a cleaner environment</p>
        </div>
      </motion.div>

      <GreenSuggestions />
    </div>
  );
};

export default GreenSuggestionsPage;