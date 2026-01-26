import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Mock user data - replace with actual user data from your auth system
    const userData = {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@aircare.ai',
        phone: '+91 98765 43210',
        avatar: null, // null means use initials
        role: 'Citizen'
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get user initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
        // Example: clear localStorage, redirect to login, etc.
        // localStorage.clear();
        // window.location.href = '/login';
        alert('Logout functionality - implement your auth logout here');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-indigo-50 transition-colors"
            >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                    {userData.avatar ? (
                        <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="text-sm">{getInitials(userData.name)}</span>
                    )}
                </div>

                {/* Name (hidden on mobile) */}
                <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-slate-800">{userData.name}</div>
                    <div className="text-xs text-slate-500">{userData.role}</div>
                </div>

                {/* Chevron Icon */}
                <ChevronDown
                    className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 glass-card bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                        {/* Profile Header */}
                        <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600">
                            <div className="flex items-center space-x-4">
                                {/* Large Avatar */}
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl border-2 border-white/30 shadow-lg">
                                    {userData.avatar ? (
                                        <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span>{getInitials(userData.name)}</span>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-white">
                                    <h3 className="text-lg font-bold">{userData.name}</h3>
                                    <p className="text-sm text-white/80">{userData.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Details */}
                        <div className="p-4 space-y-3">
                            {/* Email */}
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="p-2 rounded-lg bg-indigo-100">
                                    <Mail className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-slate-500 font-semibold">Email</div>
                                    <div className="text-sm text-slate-800 font-medium">{userData.email}</div>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="p-2 rounded-lg bg-green-100">
                                    <Phone className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-slate-500 font-semibold">Phone</div>
                                    <div className="text-sm text-slate-800 font-medium">{userData.phone}</div>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <User className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-slate-500 font-semibold">Role</div>
                                    <div className="text-sm text-slate-800 font-medium">{userData.role}</div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-4 border-t border-slate-200 space-y-2">
                            {/* Settings Button */}
                            {/* <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-semibold">Account Settings</span>
              </motion.button> */}

                            {/* Logout Button */}
                            <Link to="/">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg transition-shadow"
                                >

                                    <LogOut className="w-4 h-4" />

                                    <span className="text-sm font-semibold">Logout</span>

                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;