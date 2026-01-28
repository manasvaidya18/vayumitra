
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bug, Bird, TreeDeciduous, Info, Wind, AlertTriangle, Cloud, Sun, Leaf } from 'lucide-react';
import { fetchCitizenWildlife } from '../../../api/services';

const WildlifeImpact = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchCitizenWildlife();
        setData(result);
      } catch (error) {
        console.error("Failed to load wildlife data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
    </div>
  );

  if (!data) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'Endangered': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Vulnerable': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-green-700 bg-green-50 border-green-200';
    }
  };

  const getHealthColor = (score) => {
    if (score < 40) return '#ef4444';
    if (score < 60) return '#f97316';
    if (score < 80) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="space-y-8 font-sans">

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Bug className="w-64 h-64 text-green-900" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="p-2 rounded-xl bg-green-100 text-green-700">
                <Leaf className="w-6 h-6" />
              </span>
              <h1 className="text-3xl font-bold text-slate-800">Ecosystem Health</h1>
            </div>
            <p className="text-slate-500 max-w-xl">
              Real-time biological impact assessment of air quality on local biodiversity.
            </p>

            <div className="flex items-center mt-6 space-x-4">
              <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold flex items-center border border-blue-100">
                <Sun className="w-4 h-4 mr-2" />
                {data.season ? data.season.charAt(0).toUpperCase() + data.season.slice(1) : 'Current'} Season
              </div>
              <div className="px-4 py-1.5 bg-slate-50 text-slate-600 rounded-full text-sm font-medium flex items-center border border-slate-100">
                <Wind className="w-4 h-4 mr-2" />
                {data.location?.lat.toFixed(2)}°N, {data.location?.lon.toFixed(2)}°E
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-0 text-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div
              className="text-6xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 text-transparent bg-clip-text"
            >
              {data.overallHealth || 0}%
            </div>
            <div className="text-slate-500 text-sm font-medium mt-1">Health Index</div>

            {data.pollutants && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xs">
                {Object.entries(data.pollutants).map(([key, value]) => (
                  <div key={key} className="text-xs px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600">
                    <span className="font-bold uppercase mr-1">{key.replace('_', '.')}:</span>
                    {typeof value === 'number' ? value.toFixed(0) : value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Species Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Bug className="w-5 h-5 mr-2 text-indigo-500" />
          Species Vulnerability Matrix
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.speciesData?.map((species, index) => (
            <motion.div
              key={species.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedSpecies(species)}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 cursor-pointer transition-all hover:shadow-lg hover:border-indigo-200 ${species.status === 'Critical' ? 'border-red-100' :
                  species.status === 'Endangered' ? 'border-orange-100' :
                    species.status === 'Vulnerable' ? 'border-yellow-100' :
                      'border-green-100'
                }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl filter drop-shadow-sm">{species.icon}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(species.status)}`}>
                  {species.status}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mb-1">{species.name}</h3>
              <p className="text-xs text-slate-500 h-8 line-clamp-2 mb-4">{species.description}</p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>Health Score</span>
                    <span>{species.healthScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${species.healthScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getHealthColor(species.healthScore) }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-50">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <div className="text-slate-400 mb-1">Seasonal</div>
                    <div className="text-slate-700 font-bold">{species.seasonalFactor?.toFixed(1)}x</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <div className="text-slate-400 mb-1">Impact</div>
                    <div className="text-slate-700 font-bold">{species.currentPollution?.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-6 border border-indigo-100 shadow-sm"
        >
          <h3 className="font-bold text-lg text-indigo-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-indigo-600" />
            Vulnerability Insights
          </h3>
          <ul className="space-y-3">
            {data.speciesData
              ?.filter(s => s.healthScore < 60)
              .sort((a, b) => a.healthScore - b.healthScore)
              .slice(0, 3)
              .map(species => (
                <li key={species.id} className="flex items-center bg-white p-3 rounded-xl border border-indigo-50 shadow-sm">
                  <span className="text-2xl mr-3">{species.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-indigo-900">{species.name}</span>
                      <span className="text-red-600 font-bold text-sm bg-red-50 px-2 py-0.5 rounded-md">{species.healthScore}%</span>
                    </div>
                    <div className="text-xs text-indigo-700 mt-0.5">Critical pollutant sensitivity detected</div>
                  </div>
                </li>
              ))}
            {(!data.speciesData || data.speciesData.filter(s => s.healthScore < 60).length === 0) && (
              <div className="text-indigo-600 text-sm italic p-4 bg-indigo-50/50 rounded-xl">
                No species currently at high risk. The ecosystem is stable.
              </div>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100 shadow-sm"
        >
          <h3 className="font-bold text-lg text-emerald-900 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-emerald-600" />
            Actions for {data.season}
          </h3>
          <div className="prose prose-sm text-emerald-800">
            <p className="mb-3 font-medium">
              Current <strong>{data.season}</strong> conditions are
              {data.season === 'winter' ? ' challenging for migratory species due to inversion layers trapping pollutants.' :
                data.season === 'spring' ? ' optimal for pollinator recovery if pesticide use is minimized.' :
                  ' moderate for most species.'}
            </p>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Create water stations for birds to wash off particulate matter.</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>Plant native pollution-tolerant shrubs like Nerium and Bougainvillea.</span>
              </div>
              {data.season === 'summer' && (
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>Avoid chemical spraying during midday heat to protect bees.</span>
                </div>
              )}
              {data.season === 'winter' && (
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span>Avoid outdoor waste burning which severely impacts low-flying birds.</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center text-slate-400 text-xs mt-8">
        Biological impact scores are estimated based on species-specific pollutant sensitivity research (DOI:10.1016/j.envpol.2021.117882).
      </div>
    </div>
  );
};

export default WildlifeImpact;