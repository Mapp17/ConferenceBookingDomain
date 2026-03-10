'use client';

import { useState, useMemo, useCallback } from 'react';

// Define the Booking type locally since it's not exported from useBookings
interface Booking {
  id: number;
  roomName: string;
  start: string;
  end: string;
  userEmail: string;
  status: string;
}

export function useFilters(bookings: Booking[]) {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  // Filter by status
  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'All') return bookings;
    return bookings.filter(booking => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  // Filter by search term (room name or user email)
  const filteredBySearch = useMemo(() => {
    if (!searchTerm.trim()) return filteredByStatus;
    
    const term = searchTerm.toLowerCase();
    return filteredByStatus.filter(booking => 
      booking.roomName.toLowerCase().includes(term) ||
      booking.userEmail.toLowerCase().includes(term)
    );
  }, [filteredByStatus, searchTerm]);

  // Filter by date range
  const filteredBookings = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return filteredBySearch;
    
    return filteredBySearch.filter(booking => {
      const bookingDate = new Date(booking.start);
      
      if (dateRange.start && dateRange.end) {
        return bookingDate >= dateRange.start && bookingDate <= dateRange.end;
      } else if (dateRange.start) {
        return bookingDate >= dateRange.start;
      } else if (dateRange.end) {
        return bookingDate <= dateRange.end;
      }
      
      return true;
    });
  }, [filteredBySearch, dateRange]);

  // Get count for a specific status
  const getStatusCount = useCallback((status: string) => {
    if (status === 'All') return bookings.length;
    return bookings.filter(b => b.status === status).length;
  }, [bookings]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setStatusFilter('All');
    setSearchTerm('');
    setDateRange({ start: null, end: null });
  }, []);

  return {
    // Filter state
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    
    // Filtered results
    filteredBookings,
    
    // Utilities
    getStatusCount,
    clearFilters,
    
    // Filter stats
    totalAfterFilter: filteredBookings.length
  };
}