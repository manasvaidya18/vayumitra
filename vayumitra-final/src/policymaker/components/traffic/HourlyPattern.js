import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { useCity } from '../../../context/CityContext';

const TOMTOM_KEY = 'kuYZTwEyDCYpyi3s09ykbIM0NzKHGNn6';

const HourlyPattern = () => {
  const { city } = useCity();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveCongestion, setLiveCongestion] = useState(0);

  useEffect(() => {
    // 1. Fetch Current Live Congestion (For Scaling)
    const fetchLiveTrend = async () => {
      let currentCongestion = 30; // Default

      try {
        if (city !== 'Delhi') {
          // --- DUMMY MODE ---
          if (city === 'Mumbai' || city === 'Bangalore') {
            currentCongestion = 85;
          } else {
            currentCongestion = 45;
          }
        } else {
          // --- LIVE MODE ---
          const lat = 28.6289, lng = 77.2409;
          const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_KEY}&point=${lat},${lng}`;
          const res = await fetch(url);
          const json = await res.json();

          if (json.flowSegmentData) {
            const { currentSpeed, freeFlowSpeed } = json.flowSegmentData;
            currentCongestion = Math.max(0, Math.round(((freeFlowSpeed - currentSpeed) / freeFlowSpeed) * 100));
          }
        }

        setLiveCongestion(currentCongestion);

        // 2. Generate Adaptive Curve
        // Standard Day Profile (0-23h) - Typical Pattern
        const standardProfile = [
          15, 10, 8, 12, 25, 45, 75, 95, 100, 85, 70, 65,
          68, 72, 75, 80, 90, 100, 95, 80, 60, 45, 30, 20
        ];

        // "Adaptive Factor": If current time is e.g. 10AM and congestion is HIGH,
        // we assume the whole day curve is shifted UP.
        const currentHour = new Date().getHours();
        const expectedAtNow = standardProfile[currentHour] || 50;

        // Ratio: How much busier is it NOW than usual? (Clamped 0.5x to 2.0x)
        let trendRatio = (currentCongestion / expectedAtNow);
        if (isNaN(trendRatio) || trendRatio === 0) trendRatio = 1;
        trendRatio = Math.max(0.7, Math.min(1.5, trendRatio));

        // Generate Chart Data
        const baseScale = city === 'Delhi' ? 22000 : city === 'Pune' ? 6000 : 15000; // City Capacity Scale
        const chartData = standardProfile.map((val, hour) => {
          const h = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
          // Apply trend ratio to future/past? simpler to apply to whole day for "Today's Trend"
          return {
            hour: h,
            volume: Math.round(val * trendRatio * baseScale), // Scale to rough vehicle volume
            capacity: 120000 // Reference line (unused visually but kept for scale)
          }
        });

        setData(chartData);
        setLoading(false);

      } catch (e) {
        console.error("Hourly fetch error", e);
        setLoading(false);
      }
    };

    fetchLiveTrend();
  }, [city]);

  if (loading) return <Card>Loading traffic trends...</Card>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">📈 Hourly Traffic Prediction</h2>
        <span className={`text-xs px-2 py-1 rounded ${liveCongestion > 40 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {liveCongestion > 40 ? 'Heavy Trend' : 'Normal Trend'}
        </span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="hour" stroke="#64748b" interval={3} />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
              formatter={(val) => [`${(val / 1000).toFixed(1)}k Vehicles`, "Volume"]}
            />
            <Area type="monotone" dataKey="volume" stroke="#6366f1" fillOpacity={1} fill="url(#colorVol)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-red-50 rounded-lg p-3 border border-red-200 text-center">
          <p className="text-xs text-slate-600">Morning Peak</p>
          <p className="text-lg font-bold text-red-600">08:00 - 10:00</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 text-center">
          <p className="text-xs text-slate-600">Evening Peak</p>
          <p className="text-lg font-bold text-orange-600">17:00 - 19:00</p>
        </div>
      </div>
    </Card>
  );
};

export default HourlyPattern;