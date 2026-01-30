import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { fetchCongestion } from '../../../api/services';
import { useCity } from '../../../context/CityContext';

const TOMTOM_KEY = 'kuYZTwEyDCYpyi3s09ykbIM0NzKHGNn6';

const CongestionHotspots = () => {
  const { city } = useCity();
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset
    setHotspots([]);
    setLoading(true);

    const loadData = async () => {
      // --- DUMMY MODE FOR OTHER CITIES ---
      if (!['Delhi', 'Pune'].includes(city)) {
        await new Promise(r => setTimeout(r, 700)); // Fake network

        const dummyData = {
          'Mumbai': [
            { location: 'Bandra-Worli Sea Link', delay: 45, length: '5.2', aqiImpact: 60 },
            { location: 'Western Express Highway', delay: 35, length: '3.8', aqiImpact: 48 },
            { location: 'Andheri-Kurla Road', delay: 20, length: '1.5', aqiImpact: 30 },
          ],
          'Bangalore': [
            { location: 'Silk Board Junction', delay: 65, length: '2.4', aqiImpact: 95 },
            { location: 'Outer Ring Road (Marathahalli)', delay: 50, length: '4.1', aqiImpact: 70 },
            { location: 'Hebbal Flyover', delay: 25, length: '1.8', aqiImpact: 35 },
          ],
          'Pune': [
            { location: 'Hinjewadi Phase 2 Circle', delay: 38, length: '2.2', aqiImpact: 55 },
            { location: 'University Road (E-Square)', delay: 25, length: '1.5', aqiImpact: 40 },
            { location: 'Nagar Road (Phoenix Mall)', delay: 18, length: '1.1', aqiImpact: 28 },
            { location: 'Swargate Junction', delay: 15, length: '0.8', aqiImpact: 22 }
          ],
          'Hyderabad': [
            { location: 'Hitech City Main Rd', delay: 18, length: '1.2', aqiImpact: 25 },
            { location: 'Panjagutta Circle', delay: 12, length: '0.8', aqiImpact: 15 },
          ]
        };

        setHotspots(dummyData[city] || dummyData['Mumbai']);
        setLoading(false);
        return;
      }

      // If we are here, it's Delhi or Pune (try live fetch)
      try {
        // Dynamic BBox
        const bbox = city === 'Pune' ? '73.75,18.40,73.98,18.65' : '76.85,28.40,77.30,28.88';
        const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&bbox=${bbox}&fields={incidents{properties{iconCategory,magnitudeOfDelay,events{description},from,to,length}}}&language=en-GB`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.incidents) {
          // 1. Filter for Jams (Cat 6) with actual delay
          const jams = data.incidents
            .filter(i => i.properties.iconCategory === 6 && i.properties.magnitudeOfDelay > 60) // >1 min delay
            .map(i => {
              const p = i.properties;
              // Clean description
              const loc = p.events?.[0]?.description || `Jam from ${p.from?.substring(0, 15)}...`;
              const delayMin = Math.round(p.magnitudeOfDelay / 60);

              // Heuristic AQI Impact based on Delay + Length
              // 1 min delay ~ +1.5 AQI points locally (Idling emissions)
              const impact = Math.min(150, Math.round(delayMin * 1.5));

              return {
                location: loc,
                delay: delayMin,
                length: (p.length / 1000).toFixed(1), // km
                currentStatus: "Active",
                aqiImpact: impact
              };
            });

          // 2. Sort by Worst Delay
          jams.sort((a, b) => b.delay - a.delay);

          // 3. Take Top 8
          setHotspots(jams.slice(0, 8));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading live hotspots:", error);
        // Fallback
        const fallback = await fetchCongestion();
        setHotspots(fallback);
        setLoading(false);
      }
    };
    loadData();
  }, [city]);

  if (loading) return <Card>Loading live congestion data for {city}...</Card>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">🚧 Top Congestion Hotspots</h2>
        <span className={`text-xs px-2 py-1 rounded ${city === 'Delhi' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          {city === 'Delhi' ? 'Live Data' : 'Simulated Data'}
        </span>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-white shadow-sm">
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Location</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Current Delay</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Length</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Est. AQI Spike</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.length > 0 ? hotspots.map((hotspot, index) => (
              <tr key={index} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 text-sm font-medium text-slate-800 truncate max-w-[200px]" title={hotspot.location}>
                  {hotspot.location}
                </td>
                <td className="p-3 text-sm text-red-600 font-bold">+{hotspot.delay} min</td>
                <td className="p-3 text-sm text-slate-600">{hotspot.length} km</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${hotspot.aqiImpact > 50 ? 'bg-red-100 text-red-700' :
                    hotspot.aqiImpact > 25 ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                    +{hotspot.aqiImpact} AQI
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">No major jams reported right now.</td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="text-xs text-slate-400 mt-2 text-right">
          *AQI Spike modeled on idling duration & jam length.
        </p>
      </div>
    </Card>
  );
};

export default CongestionHotspots;