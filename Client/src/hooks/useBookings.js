import { useState, useEffect, useCallback } from "react";

export function useBookings(apiUrl) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // API call function - encapsulated inside hook
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${apiUrl}/allbookings?page=${currentPage}&pageSize=${pageSize}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setBookings(data.items || []);
      setTotalCount(data.totalCount || 0);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch bookings");
      setBookings([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, currentPage]);

  // Cancel booking function - encapsulated inside hook
  const cancelBooking = useCallback(async (bookingId) => {
    try {
      const response = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Refresh the bookings list after successful cancellation
        await fetchBookings();
      } else {
        throw new Error(`Failed to cancel booking: ${response.status}`);
      }
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
    }
  }, [apiUrl, fetchBookings]);

  // Retry connection function
  const retryConnection = useCallback(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Auto-fetch on mount and when page changes
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    cancelBooking,
    retryConnection
  };
}