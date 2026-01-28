import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import { downloadCSV } from '../../utils/helpers';

const ZoneWiseImpact = () => {
  const [stationData, setStationData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/station_rankings.json');
        if (response.ok) {
          const stations = await response.json();
          const { calculateHealthImpacts } = require('../../utils/health_impact_model');

          const impact = calculateHealthImpacts(stations);
          if (impact && impact.stationImpacts) {
            // Show Top 5 by default or maybe top 8 to fit card
            setStationData(impact.stationImpacts.slice(0, 10));
          }
        }
      } catch (error) {
        console.error("Error loading station health impact:", error);
      }
    };
    loadData();
  }, []);

  const getRiskColor = (risk) => {
    const colors = {
      SEVERE: 'bg-red-100 text-red-700',
      HIGH: 'bg-orange-100 text-orange-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-green-100 text-green-700'
    };
    return colors[risk] || colors.MEDIUM;
  };

  const handleExport = () => {
    if (stationData.length > 0) {
      downloadCSV(stationData, 'station_health_impact.csv');
    }
  };

  if (!stationData.length) return <Card>Loading station impact...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📍 Station-Wise Impact</h2>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Station</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Est. Pop.</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Excess Cases</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Risk</th>
            </tr>
          </thead>
          <tbody>
            {stationData.map((st) => (
              <tr key={st.station} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3">
                  <div className="font-bold text-slate-800 text-sm">{st.station}</div>
                  <div className="text-xs text-slate-500">{st.zone}</div>
                </td>
                <td className="p-3 text-sm text-slate-600">{st.population.toLocaleString()}</td>
                <td className="p-3 text-sm font-semibold text-slate-800">{st.cases.toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(st.risk)}`}>
                    {st.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => navigate('/policymaker/hotspots')}
        >
          View Map
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={handleExport}
        >
          Export Data
        </Button>
      </div>
    </Card>
  );
};

export default ZoneWiseImpact;