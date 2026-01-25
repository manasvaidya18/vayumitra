import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees } from 'lucide-react';
import Button from '../common/Button';

const TreeSimulator = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center p-12">
      <Trees className="w-16 h-16 text-green-600 mx-auto mb-4" />
      <h3 className="text-2xl font-bold text-slate-800 mb-4">
        Tree Simulator has been upgraded!
      </h3>
      <p className="text-slate-600 mb-6">
        This component is now part of the main Tree Impact page with interactive features.
      </p>
      <Button onClick={() => navigate('/tree-impact')}>
        Go to Tree Impact Page
      </Button>
    </div>
  );
};

export default TreeSimulator;