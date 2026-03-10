'use client';

import { useEffect } from 'react';

interface HeaderProps {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Checking for updates...');
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-semibold text-gray-800">Current Bookings</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 
                     hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-colors"
        >
          ← Previous
        </button>
        <span className="text-gray-600">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 
                     hover:bg-gray-50 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}