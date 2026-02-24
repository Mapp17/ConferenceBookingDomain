import { useState, useMemo, useCallback } from "react";

export function useFilters(bookings) {
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBookings = useMemo(() => {
    if (statusFilter === "All") return bookings;
    return bookings.filter(booking => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const getStatusCount = useCallback((status) => {
    return bookings.filter(b => b.status === status).length;
  }, [bookings]);

  return {
    statusFilter,
    setStatusFilter,
    filteredBookings,
    getStatusCount
  };
}