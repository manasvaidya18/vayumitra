import React from 'react';

const Card = ({ children, className = '', hover = false, gradient = false }) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-card p-6
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-indigo-50' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;