import React from 'react';

const FilterBar = ({ children, onApply, onReset }) => {
  return (
    <div className="bg-white rounded-lg shadow-card p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold text-slate-700">FILTERS:</span>
        {children}
        <div className="flex space-x-2 ml-auto">
          <button
            onClick={onApply}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Apply
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;