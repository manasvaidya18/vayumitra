import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    {
      title: 'City Overview',
      icon: '📊',
      path: 'dashboard',
      description: 'Dashboard'
    },
    {
      title: 'Live Air Quality',
      icon: '🌬️',
      path: 'live-air-quality',
      description: 'Real-time monitoring'
    },
    {
      title: 'Pollution Hotspots',
      icon: '🔥',
      path: 'pollution-hotspots',
      description: 'Hotspot analysis'
    },
    {
      title: 'Forecast & Warnings',
      icon: '🔮',
      path: 'forecast-warnings',
      description: 'Early alerts'
    },
    {
      title: 'Policy Simulator',
      icon: '⚙️',
      path: 'policy-simulator',
      description: 'What-if analysis'
    },
    {
      title: 'Health Impact',
      icon: '🏥',
      path: 'health-impact',
      description: 'Health analysis'
    },
    {
      title: 'Traffic & Urban',
      icon: '🚗',
      path: 'traffic-urban',
      description: 'Activity monitoring'
    },
    {
      title: 'Reports & Exports',
      icon: '📋',
      path: 'reports-exports',
      description: 'Generate reports'
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-xl transition-all duration-300 z-40 ${
        isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
      }`}
    >
      <div className="h-full overflow-y-auto py-6 px-3">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs opacity-80">{item.description}</p>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 px-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Current AQI</span>
                <span className="text-sm font-bold text-orange-600">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active Alerts</span>
                <span className="text-sm font-bold text-red-600">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Sensors Online</span>
                <span className="text-sm font-bold text-green-600">47/50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;