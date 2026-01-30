import React, { useEffect, useState } from 'react';
import Card from '../common/Card';

const DiseaseBreakdown = ({ city, currentAQI }) => {
  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    // City Scaling Factor (Population relative to Delhi ~33M)
    const popFactor = city === 'Pune' ? 0.21 : 1.0;

    // Base Prevalence Rates (per 100,000 population) - Source: Global Burden of Disease / Indian Health Ministry approx
    const basePrevalence = {
      'Asthma': 2000,      // 2%
      'COPD': 800,        // 0.8%
      'Bronchitis': 1200, // 1.2%
      'Cardiovascular': 1500, // 1.5%
      'Other': 500
    };

    // Excess Risk Factor per 100 AQI points (Multiplier on baseline)
    // e.g. at AQI 200, risk might increase by 20%
    const riskFactor = Math.max(0, (currentAQI - 50) / 100) * 0.15; // 15% increase per 100 AQI above 50

    // City Population in Millions
    const cityPopMillion = city === 'Pune' ? 7 : 33;

    const data = Object.entries(basePrevalence).map(([name, rate]) => {
      // Baseline Cases in City
      const baselineCases = Math.round((rate / 100000) * (cityPopMillion * 1000000));

      // Additional Cases due to Pollution
      const excessCases = Math.round(baselineCases * riskFactor);

      const totalCases = baselineCases + excessCases;

      let color = 'bg-slate-500';
      if (name === 'Asthma') color = 'bg-red-500';
      if (name === 'COPD') color = 'bg-orange-500';
      if (name === 'Bronchitis') color = 'bg-yellow-500';
      if (name === 'Cardiovascular') color = 'bg-blue-500';

      return { name, cases: totalCases, color };
    });

    const finalTotal = data.reduce((sum, d) => sum + d.cases, 0);
    const processed = data.map(d => ({
      ...d,
      percentage: ((d.cases / finalTotal) * 100).toFixed(1)
    }));

    setDiseases(processed);
  }, [city, currentAQI]);

  if (!diseases.length) return <Card>Loading breakdown...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Estimated Disease Burden Breakdown (at AQI {currentAQI})</h2>

      <div className="space-y-4">
        {diseases.map((disease) => (
          <div key={disease.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700">{disease.name}</span>
              <span className="text-sm text-slate-600">
                {disease.percentage}% ({disease.cases.toLocaleString()} cases)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${disease.color} transition-all duration-500`}
                style={{ width: `${disease.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DiseaseBreakdown;