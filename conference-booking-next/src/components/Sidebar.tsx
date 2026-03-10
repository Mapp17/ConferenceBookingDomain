'use client';

import ConnectionStatus from './ConnectionStatus';

interface SidebarProps {
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  getStatusCount: (status: string) => number;
  apiUrl: string;
}

export default function Sidebar({ 
  statusFilter, 
  setStatusFilter, 
  getStatusCount, 
  apiUrl 
}: SidebarProps) {
  const filters = ['All', 'Pending', 'Confirmed', 'Cancelled'];

  return (
    <aside className=" flex-shrink-0">
      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Filters
        </h3>
        <div className="space-y-2">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`w-full flex justify-between items-center px-4 py-3 rounded-lg transition-all ${
                statusFilter === filter
                  ? 'bg-primary-400 text-white'
                  : 'bg-blue-50 text-gray-700 hover:bg-blue-200'
              }`}
              onClick={() => setStatusFilter(filter)}
            >
              <span>{filter}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                statusFilter === filter
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {getStatusCount(filter)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Info Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Quick Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">API Status</span>
            <span className="text-green-600 font-medium">
              <ConnectionStatus />
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Endpoint</span>
            <span className="font-mono text-xs text-primary-500 truncate max-w-[150px]">
              {apiUrl}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}