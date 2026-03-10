'use client';

import { formatDisplayDate, calculateDuration } from '../utils/dateUtils';

interface BookingCardProps {
  id: number;
  roomName: string;
  start: string;
  end: string;
  userEmail: string;
  status: string;
  onCancel: (id: number) => void;
}

export default function BookingCard({
  id,
  roomName,
  start,
  end,
  userEmail,
  status,
  onCancel
}: BookingCardProps) {
  const canCancel = status !== 'Cancelled' && status !== 'Completed';
  const duration = calculateDuration(start, end);

  const getStatusClasses = (status: string) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800">{roomName}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusClasses(status)}`}>
          {status}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-primary-400">
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="text-gray-500 w-16">Start</span>
              <span className="text-gray-800 font-medium">{formatDisplayDate(start)}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-16">End</span>
              <span className="text-gray-800 font-medium">{formatDisplayDate(end)}</span>
            </div>
            {duration && (
              <div className="text-green-600 text-sm font-medium mt-2 pt-2 border-t border-gray-200">
                 Duration: {duration}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center text-sm mb-4">
          <span className="text-gray-500 w-16">Booked by</span>
          <span className="text-gray-800 font-medium truncate">{userEmail}</span>
        </div>

        {canCancel && (
          <div className="flex justify-end">
            <button
              onClick={() => onCancel(id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}