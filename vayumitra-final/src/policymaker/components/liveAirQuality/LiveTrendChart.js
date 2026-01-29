import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCityForecast, fetchStationForecasts, fetchMLForecast } from '../../../api/services';

const LiveTrendChart = ({ selectedStation, city }) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        let rawData = [];
        let title = "Predicted AQI Trend (Next 72 Hours)";

        if (selectedStation && selectedStation !== 'All Stations') {
          // Fetch all station forecasts and find the one we need
          // Ideally backend should provide single station API, but we have a dump
          // Wait, fetchStationForecasts is a static JSON dump in current services.js?
          // services: fetch('/data/station_forecasts.json')
          // If it's static, city won't change it unless we have /data/pune_forecasts.json
          // But wait, the user wants "data of selected city". 
          // If the JSON is generic, we can't "fix" it easily without backend change or separate files.
          // HOWEVER, the `LiveAirQuality.js` passes `city`.
          // If fetchStationForecasts is truly static, we might need a better backend endpoint.
          // BUT... `fetchCityForecast` is also static? 
          // Let's check `api/services.js` again? 
          // Ah, `fetchCityForecast` calls `/data/city_forecast_72h.json`.
          // We should probably rely on the ML endpoint (`fetchMLForecast`) which IS dynamic!
          // `fetchMLForecast` uses `/api/ml/forecast-3day?city=${city}`.
          // So I should replace `fetchCityForecast` with `fetchMLForecast(city)`.

          const allStations = await fetchStationForecasts();
          const stationData = allStations.find(s => s.name === selectedStation);
          if (stationData) {
            rawData = stationData.forecast; // Array of {time, aqi}
            title = `${selectedStation} Forecast`;
          } else {
            // Fallback to city ML forecast if station specific data is missing
            const mlData = await fetchMLForecast(city);
            rawData = mlData;
          }
        } else {
          // Fallback to city ML forecast
          const mlData = await fetchMLForecast(city);
          rawData = mlData;
        }

        const formatted = rawData.map(d => ({
          time: new Date(d.datetime || d.time).toLocaleDateString([], { weekday: 'short', hour: '2-digit' }),
          aqi: d.predicted_aqi || d.aqi
        }));
        setForecastData(formatted);
      } catch (error) {
        console.error("Error loading forecast:", error);
      }
    };
    loadData();
  }, [selectedStation, city]);

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