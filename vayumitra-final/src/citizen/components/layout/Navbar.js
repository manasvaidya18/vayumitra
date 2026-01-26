import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wind, LayoutDashboard, Trees, Bird, MessageCircle, Lightbulb, Info, Mail, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/citizen', icon: Wind },
    { name: 'Dashboard', path: '/citizen/city-selector', icon: LayoutDashboard },
    { name: 'Tree Impact', path: '/citizen/tree-impact', icon: Trees },
    { name: 'Wildlife', path: '/citizen/wildlife', icon: Bird },
    // { name: 'Chatbot', path: '/chatbot', icon: MessageCircle },
    { name: 'Green Tips', path: '/citizen/green-suggestions', icon: Lightbulb },
    { name: 'About', path: '/citizen/about', icon: Info },
    { name: 'Contact', path: '/citizen/contact', icon: Mail },
  ];

  return (
    <nav className="glass-card sticky top-0 z-50 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20"
            >
              <Wind className="w-6 h-6 text-indigo-600" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">
              VāyuMitra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow'
                      : 'text-slate-700 hover:bg-indigo-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Profile Dropdown on Mobile */}
            <ProfileDropdown />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : 'text-slate-700 hover:bg-indigo-50'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;