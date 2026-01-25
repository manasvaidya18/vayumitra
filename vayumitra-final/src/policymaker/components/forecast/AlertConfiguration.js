import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

const AlertConfiguration = () => {
  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📋 Alert Configuration</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">AQI Threshold Alerts:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <span>🟡</span>
                <span className="text-sm font-medium text-slate-700">&gt;100 (Moderate)</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2">
                <span>🟠</span>
                <span className="text-sm font-medium text-slate-700">&gt;150 (Unhealthy)</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <span>🔴</span>
                <span className="text-sm font-medium text-slate-700">&gt;200 (Very Unhealthy)</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <span>⚫</span>
                <span className="text-sm font-medium text-slate-700">&gt;300 (Hazardous)</span>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Notifications:</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-slate-700">Email</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-slate-700">SMS</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm text-slate-700">App Notification</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="secondary" className="flex-1" size="sm">
            Edit Rules
          </Button>
          <Button variant="primary" className="flex-1" size="sm">
            Add New
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AlertConfiguration;