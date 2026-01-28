import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCityForecast, fetchStationForecasts } from '../../../api/services';

const LiveTrendChart = ({ selectedStation }) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let rawData = [];
        let title = "Predicted AQI Trend (Next 72 Hours)";

        if (selectedStation && selectedStation !== 'All Stations') {
          // Fetch all station forecasts and find the one we need
          // Ideally backend should provide single station API, but we have a dump
          const allStations = await fetchStationForecasts();
          const stationData = allStations.find(s => s.name === selectedStation);
          if (stationData) {
            rawData = stationData.forecast; // Array of {time, aqi}
            title = `${selectedStation} Forecast`;
          } else {
            // Fallback to city
            const cityData = await fetchCityForecast();
            rawData = cityData;
          }
        } else {
          const cityData = await fetchCityForecast();
          rawData = cityData;
        }

        const formatted = rawData.map(d => ({
          time: new Date(d.time).toLocaleDateString([], { weekday: 'short', hour: '2-digit' }),
          aqi: d.aqi
        }));
        setForecastData(formatted);
      } catch (error) {
        console.error("Error loading forecast:", error);
      }
    };
    loadData();
  }, [selectedStation]);

  if (!forecastData.length) return <Card>Loading forecast...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📈 Predicted AQI Trend (Next 72 Hours)</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" tic={{ fontSize: 10 }} />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default LiveTrendChart;