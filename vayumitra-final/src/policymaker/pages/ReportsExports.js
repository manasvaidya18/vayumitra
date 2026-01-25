import React, { useState } from 'react';
import ReportGenerator from '../components/reports/ReportGenerator';
import RecentReports from '../components/reports/RecentReports';
import ScheduledReports from '../components/reports/ScheduledReports';
import DataExports from '../components/reports/DataExports';
import ReportTemplates from '../components/reports/ReportTemplates';

const ReportsExports = () => {
  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-3">
          <span>📋</span>
          <span>Reports & Exports Center</span>
        </h1>
        <p className="text-slate-600 mt-1">Generate, schedule, and export data reports</p>
      </div>

      {/* Report Generator */}
      <ReportGenerator />

      {/* Recent Reports */}
      <RecentReports />

      {/* Scheduled Reports and Data Exports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScheduledReports />
        <DataExports />
      </div>

      {/* Report Templates */}
      <ReportTemplates />
    </div>
  );
};

export default ReportsExports;