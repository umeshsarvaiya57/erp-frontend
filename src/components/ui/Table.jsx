import React from 'react';
import { Loader } from './Loader';

export const Table = ({
  headers = [],
  loading = false,
  className = '',
  children
}) => {
  return (
    <div className="w-full border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-slate-200 text-left text-sm ${className}`}>
          <thead className="bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} scope="col" className="px-6 py-4 select-none">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center">
                  <Loader size="md" />
                  <span className="text-xs text-slate-400 mt-2 block font-medium">Loading data...</span>
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
