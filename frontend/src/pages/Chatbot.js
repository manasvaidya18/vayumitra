import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatbotUI from '../components/features/ChatbotUI';

const Chatbot = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3 mb-8"
      >
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20">
          <MessageCircle className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text">AI Air Quality Assistant</h1>
          <p className="text-slate-600 mt-1">Get instant answers about air quality and health</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ChatbotUI />
      </motion.div>
    </div>
  );
};

export default Chatbot;