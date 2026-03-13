'use client';

import { useCallback } from 'react';

interface SortControlsProps {
  sortBy: 'date' | 'room';
  onSortChange: (sort: 'date' | 'room') => void;
}

export default function SortControls({ sortBy, onSortChange }: SortControlsProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as 'date' | 'room');
  }, [onSortChange]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
      <select
        id="sort"
        value={sortBy}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="date">Booking Date</option>
        <option value="room">Room Name</option>
      </select>
    </div>
  );
}