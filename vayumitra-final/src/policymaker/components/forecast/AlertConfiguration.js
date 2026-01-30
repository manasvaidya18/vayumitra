import React, { useEffect, useState } from 'react';
import Card from '../common/Card';

const AlertConfiguration = ({ city }) => {
  const [stage, setStage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStage = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ml/forecast-3day?city=${city}`);
        if (response.ok) {
          const data = await response.json();
          const maxAqi = Math.max(...data.map(d => d.predicted_aqi));

          let currentStage = {
            level: 'Normal',
            color: 'bg-green-100 text-green-800 border-green-200',
            description: 'Air quality is within acceptable limits.',
            actions: ['Enforce standard pollution control norms', 'Monitor regularly']
          };

          if (maxAqi > 400) {
            currentStage = {
              level: 'Stage 4 (Emergency)',
              color: 'bg-red-100 text-red-800 border-red-200',
              description: 'Severe+ category. Emergency measures active.',
              actions: [
                '⛔ Ban on entry of truck traffic',
                '⛔ Ban on construction & demolition',
                '🏢 50% staff Work From Home for public offices',
                '🏫 Closure of schools/colleges'
              ]
            };
          } else if (maxAqi > 300) {
            currentStage = {
              level: 'Stage 3 (Severe)',
              color: 'bg-orange-100 text-orange-800 border-orange-200',
              description: 'Severe category. Stringent restrictions applicable.',
              actions: [
                '⛔ Ban on BS-III petrol & BS-IV diesel cars',
                '🧹 Intensified mechanized sweeping',
                '🏭 Close stone crushers / mining',
                '🚫 Ban on diesel generators'
              ]
            };
          } else if (maxAqi > 200) {
            currentStage = {
              level: 'Stage 2 (Very Poor)',
              color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
              description: 'Very Poor category. Targeted actions active.',
              actions: [
                '🚗 Hike in parking fees to discourage private transport',
                '🚍 Augment CNG/Electric bus services',
                '💦 Regular water sprinkling on roads',
                '🏗️ Strict checks on construction sites'
              ]
            };
          } else if (maxAqi > 100) {
            currentStage = {
              level: 'Stage 1 (Poor)',
              color: 'bg-blue-100 text-blue-800 border-blue-200',
              description: 'Poor category. Early warning measures.',
              actions: [
                '🚜 Strict vigilance on waste burning',
                '🏗️ Dust control at construction sites',
                '🏭 Enforce PUC norms strictly',
                '📣 Public awareness campaigns'
              ]
            };
          }

          setStage(currentStage);
        }
      } catch (error) {
        console.error("Error fetching GRAP stage:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStage();
  }, [city]);

  if (loading) return <Card>Loading Response Plan...</Card>;
  if (!stage) return null;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📋 Response Action Plan (GRAP)</h2>

      <div className={`p-4 rounded-lg border-l-4 mb-4 ${stage.color.replace('bg-', 'bg-opacity-50 ')} border-${stage.color.split('-')[1]}-500`}>
        <div className="flex justify-between items-start">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-white bg-opacity-60`}>
              Active Phase
            </span>
            <h3 className="text-xl font-bold mb-1">{stage.level}</h3>
            <p className="text-sm opacity-90">{stage.description}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-3 border-b pb-2">Enforced Measures</h4>
        <ul className="space-y-2">
          {stage.actions.map((action, i) => (
            <li key={i} className="flex items-start text-sm text-slate-700 bg-slate-50 p-2 rounded hover:bg-slate-100 transition-colors">
              <span className="mr-2 opacity-100">{action.split(' ')[0]}</span>
              <span>{action.substring(action.indexOf(' ') + 1)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-500 italic">
          * Measures are automatically triggered based on forecast AQI as per VayuMitra Policy Engine.
        </p>
      </div>
    </Card>
  );
};

export default AlertConfiguration;