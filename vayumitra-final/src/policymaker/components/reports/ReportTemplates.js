import React from 'react';
import Card from '../common/Card';

const ReportTemplates = () => {
  const templates = [
    { name: 'Executive Brief', icon: '📄', description: 'Summary for leadership' },
    { name: 'Technical Detail', icon: '📊', description: 'In-depth analysis' },
    { name: 'Public Summary', icon: '📰', description: 'Citizen-friendly report' },
    { name: 'Media Release', icon: '📢', description: 'Press-ready format' },
    { name: 'Custom Builder', icon: '🔧', description: 'Build your own' },
  ];

  const handleUseTemplate = (template) => {
    alert(`Using template: ${template.name}`);
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🎨 Report Templates</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {templates.map((template) => (
          <div
            key={template.name}
            onClick={() => handleUseTemplate(template)}
            className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-lg p-4 text-center border-2 border-slate-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-lg"
          >
            <div className="text-4xl mb-2">{template.icon}</div>
            <p className="text-sm font-semibold text-slate-800 mb-1">{template.name}</p>
            <p className="text-xs text-slate-600 mb-3">{template.description}</p>
            <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium transition-colors">
              Use
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ReportTemplates;