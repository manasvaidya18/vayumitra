import React from 'react';
import Card from '../common/Card';
import { mockSourceAttribution } from '../../data/mockData';

const SourceAttribution = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Source Attribution</h2>
      
      <div className="space-y-4">
        {mockSourceAttribution.map((source) => (
          <div key={source.source}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{source.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{source.source}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{source.percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${source.percentage}%`,
                  backgroundColor: source.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SourceAttribution;