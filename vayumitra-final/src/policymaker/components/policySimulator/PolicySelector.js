import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { CITY_POLICY_CATEGORIES } from '../../utils/constants';

const PolicySelector = ({ city, selectedPolicies, setSelectedPolicies, onRunSimulation }) => {
  const currentCategories = CITY_POLICY_CATEGORIES[city] || CITY_POLICY_CATEGORIES.Delhi;

  const handlePolicyToggle = (policy) => {
    const isSelected = selectedPolicies.find(p => p.id === policy.id);
    if (isSelected) {
      setSelectedPolicies(selectedPolicies.filter(p => p.id !== policy.id));
    } else {
      setSelectedPolicies([...selectedPolicies, policy]);
    }
  };

  const isPolicySelected = (policyId) => {
    return selectedPolicies.some(p => p.id === policyId);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">⚙️ Select Policy Interventions ({city})</h2>

      <div className="space-y-6">
        {Object.entries(currentCategories).map(([key, category]) => (
          <div key={key} className="border-b border-slate-200 pb-4 last:border-b-0">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center space-x-2">
              <span className="text-2xl">{category.icon}</span>
              <span>{category.name}</span>
            </h3>
            <div className="space-y-2">
              {category.policies.map((policy) => (
                <label
                  key={policy.id}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors border border-slate-200"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isPolicySelected(policy.id)}
                      onChange={() => handlePolicyToggle(policy)}
                      className="w-5 h-5 text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{policy.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1" title={policy.description}>{policy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-600">Impact:</span>
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.abs(policy.impact) * 4}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-green-600">{policy.impact}% AQI</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          icon="▶"
          onClick={onRunSimulation}
          disabled={selectedPolicies.length === 0}
        >
          Run Simulation
        </Button>
      </div>
    </Card>
  );
};

export default PolicySelector;