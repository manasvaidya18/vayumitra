import React, { useState } from 'react';
import PolicySelector from '../components/policySimulator/PolicySelector';
import SimulationResults from '../components/policySimulator/SimulationResults';
import ImpactBreakdown from '../components/policySimulator/ImpactBreakdown';
import Timeline from '../components/policySimulator/Timeline';

const PolicySimulator = () => {
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [simulationRun, setSimulationRun] = useState(false);

  const handleRunSimulation = () => {
    setSimulationRun(true);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <span>⚙️</span>
          <span>Policy Simulator - What-If Analysis</span>
        </h1>
        <p className="text-slate-600 mt-1">Model the impact of policy interventions</p>
      </div>

      {/* Policy Selector */}
      <PolicySelector 
        selectedPolicies={selectedPolicies}
        setSelectedPolicies={setSelectedPolicies}
        onRunSimulation={handleRunSimulation}
      />

      {/* Results Section */}
      {simulationRun && (
        <>
          <SimulationResults selectedPolicies={selectedPolicies} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImpactBreakdown />
            <Timeline />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
              <span>💾</span>
              <span>Save Scenario</span>
            </button>
            <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <span>📊</span>
              <span>Compare Scenarios</span>
            </button>
            <button className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <span>📋</span>
              <span>Generate Report</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PolicySimulator;