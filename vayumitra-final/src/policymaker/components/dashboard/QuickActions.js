import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">⚡ Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Button
          variant="primary"
          icon="📋"
          onClick={() => navigate('/policymaker/reports-exports')}
        >
          Generate Report
        </Button>
        <Button
          variant="secondary"
          icon="📢"
          onClick={() => alert('Issue Advisory feature')}
        >
          Issue Advisory
        </Button>
        <Button
          variant="secondary"
          icon="🔔"
          onClick={() => navigate('/policymaker/forecast-warnings')}
        >
          Set Alert
        </Button>
        <Button
          variant="secondary"
          icon="📊"
          onClick={() => navigate('/policymaker/policy-simulator')}
        >
          Policy Simulator
        </Button>
        <Button
          variant="secondary"
          icon="📥"
          onClick={() => navigate('/policymaker/reports-exports')}
        >
          Export Data
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;