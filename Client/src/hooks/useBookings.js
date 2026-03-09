import { useEffect, useState, useCallback } from 'react';
import apiClient from '../api/apiClient';
import * as signalR from '@microsoft/signalr';

export function useBookings(page = 1, pageSize = 10) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.get(
        `/bookings/allbookings?page=${page}&pageSize=${pageSize}`
      );
      
      setBookings(data.items ?? []);
      setTotalCount(data.totalCount ?? 0);
    } catch (err) {
      console.error('❌ Failed to load bookings:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out');
      } else if (err.message === 'Network Error') {
        setError('Network error');
      } else if (err.response?.status === 401) {
        setError('Session expired');
      } else {
        setError(err.response?.data?.message || 'Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // SignalR connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5151/hubs/bookings', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log(' SignalR connected'))
      .catch(err => console.error(' SignalR error:', err));

    connection.on('BookingCreated', (newBooking) => {
      setBookings(prev => [newBooking, ...prev]);
      setTotalCount(prev => prev + 1);
    });

    connection.on('BookingUpdated', (updatedBooking) => {
      setBookings(prev => 
        prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
      );
    });

    connection.on('BookingCancelled', (cancelledId) => {
      setBookings(prev => 
        prev.map(b => 
          b.id === cancelledId ? { ...b, status: 'Cancelled' } : b
        )
      );
    });

    return () => {
      connection.stop();
    };
  }, []);

  // Create booking
  const createBooking = useCallback(async (bookingData) => {
    setError(null);
    
    try {
      const response = await apiClient.post('/bookings', bookingData);
      
      setBookings(prev => {
        const exists = prev.some(b => b.id === response.id);
        if (!exists) {
          return [response, ...prev];
        }
        return prev;
      });
      
      return response;
    } catch (err) {
      console.error(' Create error:', err);
      
      if (err.response?.status === 409) {
        setError('Room already booked for this time');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid booking data');
      } else {
        setError('Failed to create booking');
      }
      
      throw err;
    }
  }, []);

  // Cancel booking
  const cancelBooking = useCallback(async (bookingId) => {
    setError(null);
    
    try {
      await apiClient.delete(`/bookings/${bookingId}`);
      
      // Optimistic update
      setBookings(prev => 
        prev.map(b => 
          b.id === bookingId ? { ...b, status: 'Cancelled' } : b
        )
      );
      
    } catch (err) {
      console.error(' Cancel error:', err);
      setError('Failed to cancel booking');
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    totalCount,
    createBooking,
    cancelBooking,
    refreshBookings: fetchBookings
  };
}