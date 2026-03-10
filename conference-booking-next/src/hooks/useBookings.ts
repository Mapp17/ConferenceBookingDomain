'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';

export interface Booking {
  id: number;
  roomName: string;
  start: string;
  end: string;
  userEmail: string;
  status: string;
}

export function useBookings(page = 1, pageSize = 10) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(` Fetching bookings: page ${page}, pageSize ${pageSize}`);
      
      const response = await apiClient.get(`/bookings/allbookings?page=${page}&pageSize=${pageSize}`);
      
      console.log(' API Response received:');
      console.log('Response type:', typeof response);
      console.log('Is array?', Array.isArray(response));
      console.log('Response keys:', Object.keys(response || {}));
      console.log('Full response:', JSON.stringify(response, null, 2));
      
      // Try to extract items
      let items: Booking[] = [];
      
      if (response && response.items) {
        console.log(' Found response.items');
        items = response.items;
      } else if (response && response.data && response.data.items) {
        console.log(' Found response.data.items');
        items = response.data.items;
      } else if (Array.isArray(response)) {
        console.log(' Response is array directly');
        items = response;
      } else {
        console.log(' Could not find items in response');
      }
      
      setBookings(items);
      
    } catch (err: any) {
      console.error(' Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

    // Cancel a booking
  const cancelBooking = async (id: number) => {
    try {
      await apiClient.post(`/bookings/${id}/cancel`); // adjust API endpoint if different
      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: 'Cancelled' } : b
        )
      );
    } catch (err: any) {
      console.error('Failed to cancel booking:', err.message || err);
      setError('Failed to cancel booking');
    }
  };


  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, fetchBookings, cancelBooking };
}