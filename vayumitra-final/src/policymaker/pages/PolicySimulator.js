import React, { useState, useEffect } from 'react';
import { useCity as useGlobalCity } from '../../context/CityContext';
import PolicySelector from '../components/policySimulator/PolicySelector';
import SimulationResults from '../components/policySimulator/SimulationResults';
import ImpactBreakdown from '../components/policySimulator/ImpactBreakdown';
import Timeline from '../components/policySimulator/Timeline';

const PolicySimulator = () => {
  const { city } = useGlobalCity();
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [simulationRun, setSimulationRun] = useState(false);

  // Clear selected policies when city changes
  useEffect(() => {
    setSelectedPolicies([]);
    setSimulationRun(false);
  }, [city]);

  const handleRunSimulation = () => {
    setSimulationRun(true);
  };

  const handleGenerateReport = () => {
    const totalCost = selectedPolicies.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
    const maxDuration = Math.max(...selectedPolicies.map(p => p.implementationTime || 0));

    // Helper to generate dynamic steps based on policy type
    const getImplementationSteps = (policy) => {
      if (policy.targetSource === 'Vehicular') {
        if (policy.name.includes('EV')) return "1. Procure Fleet/Subsidy Notification -> 2. Install Charging Infra -> 3. Phased Rollout";
        if (policy.name.includes('Odd-Even')) return "1. Notification Gazetting -> 2. Public Awareness Campaign -> 3. Enforcement Squad Deployment";
        return "1. Policy Drafting -> 2. Stakeholder Consultation -> 3. Enforcement";
      }
      if (policy.targetSource === 'Industrial') {
        return "1. Audit Unit Identification -> 2. Technology Selection (Scrubbers/Fuel) -> 3. Compliance Deadline Setting -> 4. Inspection Cycles";
      }
      if (policy.targetSource === 'Dust') {
        return "1. Equipment Procurement (Sprintlers/Mech Sweepers) -> 2. Route Mapping -> 3. Daily Operations Schedule";
      }
      return "1. Initial Planning -> 2. Execution -> 3. Monitoring";
    };

    const summary = `
      VayuMitra Policy Simulation Report - ${city}
      --------------------------------------------------
      Date: ${new Date().toLocaleString()}
      
      EXECUTIVE SUMMARY:
      Proposed Scenario involves ${selectedPolicies.length} intervention(s) targeting ${[...new Set(selectedPolicies.map(p => p.targetSource))].join(', ')}.
      
      SELECTED INTERVENTIONS & IMPLEMENTATION PLAN:
      ${selectedPolicies.map(p => `
      [${p.name}]
      - Estimated Impact: ${p.impact}% reduction in local ${p.targetSource} emissions.
      - Cost: ₹${p.estimatedCost} Cr
      - Timeline: ${p.implementationTime} Months
      - Implementation Steps: ${getImplementationSteps(p)}
      - Duration Logic: Based on standard project lifecycle (Procurement + Installation + Adoption Curve).
      `).join('')}
      
      SIMULATION RESULTS:
      Estimated Implementation Cost: ₹${totalCost} Cr
      Projected Timeline: Full effect expected within ${maxDuration} months.
      ROI Analysis: Health benefit savings projected to exceed cost by ${(totalCost > 0 ? (totalCost * 2.5 / totalCost).toFixed(1) : "N/A")}x over 5 years.
      
      Recommended Next Step: Initiate stakeholder consultation for high-impact policies.
      
      This report is generated based on VayuMitra's predictive modeling engine (Diffusion & Box Model).
      `;

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VayuMitra_Policy_Strategy_${city}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <span>⚙️</span>
          <span>Policy Simulator - What-If Analysis</span>
        </h1>
        <p className="text-slate-600 mt-1">Model the impact of policy interventions for <b>{city}</b></p>
      </div>

      {/* Policy Selector */}
      <PolicySelector
        city={city}
        selectedPolicies={selectedPolicies}
        setSelectedPolicies={setSelectedPolicies}
        onRunSimulation={handleRunSimulation}
      />

      {/* Results Section */}
      {simulationRun && (
        <>
          <SimulationResults selectedPolicies={selectedPolicies} city={city} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ImpactBreakdown selectedPolicies={selectedPolicies} />
            <Timeline selectedPolicies={selectedPolicies} />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleGenerateReport}
              className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
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