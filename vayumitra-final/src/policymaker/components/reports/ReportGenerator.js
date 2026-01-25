import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { REPORT_TYPES, EXPORT_FORMATS } from '../../utils/constants';

const ReportGenerator = () => {
  const [selectedType, setSelectedType] = useState('daily-summary');
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-31');

  const handleGenerate = () => {
    alert(`Generating ${selectedType} report in ${selectedFormat} format...`);
  };

  const handleSchedule = () => {
    alert('Opening schedule configuration...');
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">🆕 Generate New Report</h2>
      
      <div className="space-y-4">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Report Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {REPORT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Zones */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Zones:
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-sm">All</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Zone A</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Zone B</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Zone C</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Zone D</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Zone E</span>
            </label>
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Format:
          </label>
          <div className="flex space-x-3">
            {EXPORT_FORMATS.map((format) => (
              <label
                key={format.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="format"
                  value={format.value}
                  checked={selectedFormat === format.value}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-xl">{format.icon}</span>
                <span className="text-sm">{format.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button variant="primary" icon="📄" onClick={handleGenerate} className="flex-1">
            Generate Report
          </Button>
          <Button variant="secondary" icon="📅" onClick={handleSchedule} className="flex-1">
            Schedule Report
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReportGenerator;