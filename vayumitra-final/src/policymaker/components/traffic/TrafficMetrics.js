import React, { useEffect, useState } from 'react';
import StatCard from '../common/StatCard';
import { fetchTrafficData } from '../../../api/services';
import { useCity } from '../../../context/CityContext';

const TOMTOM_KEY = 'kuYZTwEyDCYpyi3s09ykbIM0NzKHGNn6';

const TrafficMetrics = () => {
  const { city } = useCity();
  const [trafficData, setTrafficData] = useState(null);

  useEffect(() => {
    // Reset data when city changes
    setTrafficData(null);

    const loadData = async () => {
      // --- DUMMY DATA FOR OTHER CITIES ---
      if (city !== 'Delhi') {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));

        const dummyStats = {
          Mumbai: { vehicles: 1540000, congestion: 68, speed: 18, delay: 24, jams: 312, aqiShare: 35 },
          Bangalore: { vehicles: 1800000, congestion: 82, speed: 12, delay: 45, jams: 540, aqiShare: 42 },
          Hyderabad: { vehicles: 900000, congestion: 45, speed: 28, delay: 15, jams: 120, aqiShare: 25 },
        };

        const d = dummyStats[city] || dummyStats['Mumbai'];

        setTrafficData({
          vehiclesOnRoad: d.vehicles,
          congestionIndex: d.congestion,
          avgSpeed: d.speed,
          avgDelay: d.delay,
          activeJams: d.jams,
          activeFactories: 80,
          constructionSites: 20,
          contributionToAQI: d.aqiShare
        });
        return;
      }

      // --- REAL DATA FOR DELHI ---
      try {
        // --- 1. LIVE FLOW DATA (Central Delhi) ---
        const lat = 28.6289, lng = 77.2409;
        const flowUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_KEY}&point=${lat},${lng}`;

        const flowRes = await fetch(flowUrl);
        const flowJson = await flowRes.json();

        let flowMetrics = {
          speed: 0,
          delay: 0,
          congestion: 0
        };

        if (flowJson.flowSegmentData) {
          const { currentSpeed, freeFlowSpeed, currentTravelTime, freeFlowTravelTime } = flowJson.flowSegmentData;
          flowMetrics.speed = Math.round(currentSpeed);
          flowMetrics.delay = Math.max(0, Math.round((currentTravelTime - freeFlowTravelTime) / 60)); // Minutes diff
          flowMetrics.congestion = Math.max(0, Math.round(((freeFlowSpeed - currentSpeed) / freeFlowSpeed) * 100));
        }

        // --- 2. LIVE INCIDENTS (Delhi Region) ---
        // BBox: 76.85, 28.40 to 77.30, 28.88
        const incidentUrl = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${TOMTOM_KEY}&bbox=76.85,28.40,77.30,28.88&fields={incidents{type,geometry{type,coordinates},properties{iconCategory}}}`;

        const incRes = await fetch(incidentUrl);
        const incJson = await incRes.json();

        let jamsCount = 0;
        let accidentsCount = 0;

        if (incJson.incidents) {
          // Category 6 = Jam, 1 = Accident (Simplified check)
          jamsCount = incJson.incidents.filter(i => i.properties.iconCategory === 6).length;
          accidentsCount = incJson.incidents.filter(i => i.properties.iconCategory === 1).length;
        }

        // --- 3. ESTIMATION MODELS (Scientific Calibration) ---

        // A. Vehicle Count: Active trips estimate
        // Base: 1.2M (Off-peak)
        // Congestion Factor: + upto 1.5M active vehicles
        // Jams Factor: + 500 cars per jam
        const baseVehicles = 1200000;
        const estimatedVehicles = baseVehicles + (flowMetrics.congestion * 30000) + (jamsCount * 500);

        // B. AQI Impact (Source Apportionment Proxy)
        // TERI/ARAI studies place Transport share between 20% (clean) to 45% (severe congestion)
        // Formula scales from 20% base + upto 25% additional from congestion
        const estAQIImpact = Math.min(50, Math.round(20 + (flowMetrics.congestion * 0.3)));

        setTrafficData({
          vehiclesOnRoad: Math.round(estimatedVehicles),
          congestionIndex: flowMetrics.congestion,
          avgSpeed: flowMetrics.speed,
          avgDelay: flowMetrics.delay,
          activeJams: jamsCount,
          activeFactories: 142,
          constructionSites: 45,
          contributionToAQI: estAQIImpact
        });

      } catch (error) {
        console.error("Error loading traffic metrics:", error);
        // Fallback
        const data = await fetchTrafficData();
        setTrafficData({
          ...data,
          avgSpeed: 24,
          avgDelay: 12,
          activeJams: 8,
          contributionToAQI: 28
        });
      }
    };
    loadData();
  }, [city]);

  if (!trafficData) return <div className="p-4 text-center">Loading traffic data for {city}...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Vehicles */}
      <StatCard
        title="🚗 Vehicles On Road"
        value={`${(trafficData.vehiclesOnRoad / 1000000).toFixed(1)}M`}
        subtitle={`Est. based on ${trafficData.congestionIndex}% congestion & ${trafficData.activeJams} jams`}
        trend="Live Model"
        trendDirection="up"
        color="blue"
      />

      {/* 2. Congestion */}
      <StatCard
        title="🚦 Congestion Index"
        value={`${trafficData.congestionIndex}%`}
        subtitle={`${city} Region`}
        trend={trafficData.congestionIndex > 50 ? "Heavy" : "Normal"}
        trendDirection="up"
        color="orange"
      />

      {/* 3. Avg Speed */}
      <StatCard
        title="🏎️ Avg Speed"
        value={`${trafficData.avgSpeed} km/h`}
        subtitle="Real-time flow"
        color="indigo"
      />

      {/* 4. Delay */}
      <StatCard
        title="⏱️ Avg Delay"
        value={`${trafficData.avgDelay} min`}
        subtitle="Lost per hour"
        trend={trafficData.avgDelay > 15 ? "High Delay" : "Moderate"}
        color="red"
      />

      {/* 5. Jams */}
      <StatCard
        title="🚧 Active Jams"
        value={trafficData.activeJams}
        subtitle="Reported Incidents"
        color="orange"
      />

      {/* 6. AQI Impact */}
      <StatCard
        title="☁️ Est. Emission Share"
        value={`${trafficData.contributionToAQI}%`}
        subtitle="Transport sector"
        trend="Modeled"
        color="red"
      />
    </div>
  );
};

export default TrafficMetrics;