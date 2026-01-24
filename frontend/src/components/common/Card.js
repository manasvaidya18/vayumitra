import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`glass-card p-6 ${hover ? 'hover:shadow-glow-lg hover:-translate-y-1' : ''} transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;