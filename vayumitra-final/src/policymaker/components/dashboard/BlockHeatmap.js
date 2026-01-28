
import React, { useEffect, useState } from 'react';
import Card from '../common/Card';

const BlockHeatmap = ({
    dataUrl = '/data/city_forecast_72h.json',
    title = 'Delhi 72-Hour Prediction Matrix',
    subtitle = 'Hourly Forecast (XGBoost Model)',
    range = 'forecast' // 'today', 'week', 'month', 'forecast'
}) => {
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForecast = async () => {
            setLoading(true);
            try {
                // Determine URL based on range if generic passed
                let url = dataUrl;
                if (range === 'today' || range === 'week') {
                    url = '/data/city_history_168h.json';
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();

                    // Filter logic
                    let filtered = data;
                    if (range === 'today') {
                        // Last 24 entries (assuming sorted newest last, but history usually sorted oldest first)
                        // History file: sorted by time asc usually.
                        // Let's take last 24 items
                        filtered = data.slice(-24);
                    }
                    // For week, take all (168h)

                    // Unified Data Parsing Logic
                    let parsedData = [];
                    if (Array.isArray(data)) {
                        parsedData = data;
                    } else if (data.forecasts) {
                        parsedData = data.forecasts;
                    } else if (typeof data === 'object') {
                        // Try to find an array value if wrapped
                        parsedData = Object.values(data).find(v => Array.isArray(v)) || [];
                    }

                    if (parsedData.length === 0) {
                        console.warn("Forecast data is empty or invalid structure", data);
                    }

                    // Map 'datetime' (backend) to 'time' (frontend expected)
                    // Also ensure we have 'aqi'
                    const mappedData = parsedData.map(item => ({
                        ...item,
                        time: item.time || item.datetime, // Handle backend vs static file difference
                        aqi: item.aqi || item.predicted_aqi // Handle 'predicted_aqi' from ML backend
                    })).filter(item => item.time && item.aqi !== undefined);

                    setForecastData(mappedData);
                }
            } catch (err) {
                console.error("Failed to fetch forecast/history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [dataUrl, range]);

    if (loading) return <Card>Loading Data Matrix...</Card>;

    // CPCB Standard Colors
    const getAQIColor = (value) => {
        if (value <= 50) return '#00B050'; // Good
        if (value <= 100) return '#92D050'; // Satisfactory
        if (value <= 200) return '#FFFF00'; // Moderate
        if (value <= 300) return '#FF7E00'; // Poor
        if (value <= 400) return '#FF0000'; // Very Poor
        return '#7E0023'; // Severe
    };

    // Organize data by Day
    const days = {};
    forecastData.forEach(item => {
        const dateObj = new Date(item.time);
        const dateKey = dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

        if (!days[dateKey]) {
            days[dateKey] = Array(24).fill(null);
        }

        const hour = dateObj.getHours();
        days[dateKey][hour] = item.aqi;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span>{range === 'forecast' ? '🔮' : '📅'}</span> {title}
                    <span className="text-xs font-normal text-white bg-indigo-600 px-2 py-1 rounded-full shadow-md">City Avg</span>
                </h2>
                <span className="text-xs text-slate-500">{subtitle}</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-left text-slate-500 font-semibold border-b border-slate-200 sticky left-0 bg-white z-10 w-32">Date</th>
                            {hours.map(h => (
                                <th key={h} className="p-1 text-center text-slate-400 font-normal border-b border-slate-200 min-w-[30px] text-[10px]">
                                    {h}h
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(days).map(([dateLabel, hourValues], idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="p-2 font-bold text-slate-700 border-b border-slate-100 whitespace-nowrap sticky left-0 bg-white z-10 border-r border-slate-200">
                                    {dateLabel}
                                </td>
                                {hourValues.map((val, hIdx) => {
                                    if (val === null) {
                                        return <td key={hIdx} className="p-1 border-b border-slate-100 bg-slate-50"></td>;
                                    }

                                    const color = getAQIColor(val);
                                    // Text color logic
                                    const textColor = (color === '#FFFF00' || color === '#92D050') ? '#000' : '#FFF';

                                    return (
                                        <td key={hIdx} className="p-0 border-b border-slate-100 border-r border-white/20">
                                            <div
                                                className="w-full h-10 flex items-center justify-center text-[10px] font-bold"
                                                style={{ backgroundColor: color, color: textColor }}
                                                title={`Hour: ${hIdx}:00 | AQI: ${Math.round(val)}`}
                                            >
                                                {Math.round(val)}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 flex flex-wrap gap-4 justify-center text-xs text-slate-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#00B050]"></div> Good</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#92D050]"></div> Satisfactory</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#FFFF00]"></div> Moderate</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#FF7E00]"></div> Poor</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#FF0000]"></div> Very Poor</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#7E0023]"></div> Severe</div>
            </div>

            <div className="mt-1 text-center text-[10px] text-slate-400 italic">
                * Aggregated average {range === 'forecast' ? 'forecast' : 'history'} across all monitoring stations.
            </div>
        </Card>
    );
};

export default BlockHeatmap;
