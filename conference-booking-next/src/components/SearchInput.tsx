'use client';

import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface SearchInputProps {
  onSearch: (term: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [inputValue, setInputValue] = useState('');

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 400),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="relative flex-1">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search bookings by room or user..."
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}