import React, { useEffect, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { fetchScheduledReports } from '../../../api/services';

const ScheduledReports = () => {
  const [scheduledReports, setScheduledReports] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchScheduledReports();
        setScheduledReports(data);
      } catch (error) {
        console.error("Error loading scheduled reports:", error);
      }
    };
    loadData();
  }, []);

  if (!scheduledReports.length) return <Card>Loading scheduled reports...</Card>;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">📅 Scheduled Reports</h2>

      <div className="space-y-3">
        {scheduledReports.map((report, index) => (
          <div
            key={index}
            className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-800">{report.report}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Frequency: <span className="font-medium">{report.frequency}</span>
                </p>
                <p className="text-xs text-slate-600">
                  Next Run: <span className="font-medium">{report.nextRun}</span>
                </p>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 hover:bg-white rounded text-sm" title="Edit">
                  ✏️
                </button>
                <button className="p-2 hover:bg-white rounded text-sm" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex space-x-2">
        <Button variant="secondary" size="sm" className="flex-1">
          Edit Schedules
        </Button>
        <Button variant="primary" size="sm" className="flex-1">
          Add New Schedule
        </Button>
      </div>
    </Card>
  );
};

export default ScheduledReports;