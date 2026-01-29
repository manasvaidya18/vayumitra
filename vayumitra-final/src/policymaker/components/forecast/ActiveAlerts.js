import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const ActiveAlerts = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🚨 Active Alerts</h2>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-4 border-2 border-red-200 mb-4">
        <div className="flex items-start space-x-3">
          <span className="text-3xl">🔴</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-700 mb-2">SEVERE</h3>
            <p className="text-sm text-red-600 mb-2">Tomorrow: AQI 165+</p>
            <p className="text-sm text-slate-700 mb-2">Areas: Zone 2, 5, 7</p>

            <div className="mt-3 space-y-1">
              <p className="text-sm font-semibold text-slate-700">Recommended Actions:</p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4">
                <li>• School advisories issued</li>
                <li>• Traffic restrictions planned</li>
                <li>• Industry notices sent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* <Button variant="danger" className="w-full" icon="📢">
        Issue Public Advisory
      </Button> */}
    </Card>
  );
};

export default ActiveAlerts;