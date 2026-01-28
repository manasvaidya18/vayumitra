import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchSensors } from '../../../api/services';

const Sidebar = ({ isOpen }) => {
  const [stats, setStats] = useState({
    aqi: '-',
    alerts: 0,
    online: '0/0'
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const sensors = await fetchSensors();
        if (sensors && sensors.length > 0) {
          // 1. Avg AQI
          const validSensors = sensors.filter(s => s.aqi && !isNaN(s.aqi) && s.aqi !== '-');
          const avgAqi = validSensors.reduce((acc, curr) => acc + Number(curr.aqi), 0) / validSensors.length;

          // 2. Active Alerts (Severe > 400 or Very Poor > 300)
          const alerts = validSensors.filter(s => Number(s.aqi) > 300).length;

          // 3. Online Status
          setStats({
            aqi: Math.round(avgAqi) || '-',
            alerts: alerts,
            online: `${validSensors.length}/${sensors.length}` // e.g. 38/40
          });
        }
      } catch (e) {
        console.error("Sidebar stats error", e);
      }
    };
    getStats();
  }, []);

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
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-xl transition-all duration-300 z-40 ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
        }`}
    >
      <div className="h-full overflow-y-auto py-6 px-3">
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
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

        {/* Quick Stats - Live Data */}
        <div className="mt-8 px-4">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center justify-between">
              <span>Quick Stats</span>
              <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded">LIVE</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Avg City AQI</span>
                <span className={`text-sm font-bold ${Number(stats.aqi) > 300 ? 'text-red-700' : 'text-orange-600'}`}>
                  {stats.aqi}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Active Alerts</span>
                <span className={`text-sm font-bold ${stats.alerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.alerts}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">Sensors Online</span>
                <span className="text-sm font-bold text-green-600">{stats.online}</span>
              </div>
            </div>
            {/* Timestamp */}
            <div className="mt-2 text-[10px] text-slate-400 text-right">
              Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;