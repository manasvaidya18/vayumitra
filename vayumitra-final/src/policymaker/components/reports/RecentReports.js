import React from 'react';
import Card from '../common/Card';
import { mockReports } from '../../data/mockData';

const RecentReports = () => {
  const handleDownload = (report) => {
    alert(`Downloading ${report.name}...`);
  };

  const handleEmail = (report) => {
    alert(`Emailing ${report.name}...`);
  };

  const handleDelete = (report) => {
    if (window.confirm(`Delete ${report.name}?`)) {
      alert('Report deleted');
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">📁 Recent Reports</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search reports..."
            className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <span className="text-xl">🔍</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Report Name</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Type</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Date</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Size</th>
              <th className="text-center p-3 text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report) => (
              <tr key={report.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="p-3 text-sm font-medium text-slate-800">{report.name}</td>
                <td className="p-3 text-sm text-slate-600">{report.type}</td>
                <td className="p-3 text-sm text-slate-600">{report.date}</td>
                <td className="p-3 text-sm text-slate-600">{report.size}</td>
                <td className="p-3">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDownload(report)}
                      className="p-1 hover:bg-green-100 rounded text-xl"
                      title="Download"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => handleEmail(report)}
                      className="p-1 hover:bg-blue-100 rounded text-xl"
                      title="Email"
                    >
                      📧
                    </button>
                    <button
                      onClick={() => handleDelete(report)}
                      className="p-1 hover:bg-red-100 rounded text-xl"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium text-sm transition-colors">
          View All Reports →
        </button>
        <p className="text-sm text-slate-600">Page 1 of 12</p>
      </div>
    </Card>
  );
};

export default RecentReports;