import React, { useState, useEffect } from 'react';
import FilterBar from '../components/common/FilterBar';
import RealTimeMap from '../components/liveAirQuality/RealTimeMap';
import SensorDataTable from '../components/liveAirQuality/SensorDataTable';
import LiveTrendChart from '../components/liveAirQuality/LiveTrendChart';
import PollutantComparison from '../components/liveAirQuality/PollutantComparison';
import { fetchSensors } from '../../api/services';
import { useCity as useGlobalCity } from '../../context/CityContext';

const LiveAirQuality = () => {
  const { city } = useGlobalCity(); // Global City
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Filters State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStation, setSelectedStation] = useState('All Stations');
  const [selectedPollutant, setSelectedPollutant] = useState('All Pollutants');

  // Data for filters
  const [stationsList, setStationsList] = useState([]);

  useEffect(() => {
    const loadStations = async () => {
      try {
        // Fetch sensors for the selected city
        // We will update fetchSensors to accept city param
        const data = await fetchSensors(city);
        if (data) {
          // Flatten if backend groups by city, or just filter if it returns all
          // Assuming backend will handle filtering or return list
          const sorted = data.map(s => s.id).sort();
          setStationsList(sorted);
        }
      } catch (e) {
        console.error("Failed to load stations list", e);
      }
    };
    loadStations();
  }, [city]); // Reload when city changes

  const handleApply = () => {
    // Trigger refresh or just let state flow down
    console.log("Filters applied:", { date, selectedStation, selectedPollutant });
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
            <span>🌬️</span>
            <span>Live Air Quality Monitoring</span>
          </h1>
          <p className="text-slate-600 mt-1">Real-time sensor data and analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${autoRefresh
              ? 'bg-green-100 text-green-700 border-2 border-green-300'
              : 'bg-slate-100 text-slate-700'
              }`}
          >
            <span className={autoRefresh ? 'animate-spin' : ''}>🔄</span>
            <span className="font-medium">Auto-refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar onApply={handleApply}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option>All Stations</option>
          {stationsList.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
        <select
          value={selectedPollutant}
          onChange={(e) => setSelectedPollutant(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option>All Pollutants</option>
          <option>AQI</option>
          <option>PM2.5</option>
          <option>PM10</option>
          <option>NO2</option>
          <option>SO2</option>
          <option>CO</option>
          <option>O3</option>
        </select>
      </FilterBar>

      {/* Real-Time Map */}
      <RealTimeMap
        selectedStation={selectedStation}
        selectedPollutant={selectedPollutant}
        city={city}
      />

      {/* Sensor Data and Live Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorDataTable
          selectedStation={selectedStation}
          selectedPollutant={selectedPollutant}
          city={city}
        />
        <LiveTrendChart
          selectedStation={selectedStation}
          selectedPollutant={selectedPollutant}
          city={city}
        />
      </div>

      {/* Pollutant Comparison */}
      <PollutantComparison
        selectedStation={selectedStation}
        city={city}
      />
    </div>
  );
};

export default LiveAirQuality;