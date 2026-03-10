'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { signalRService } from '../services/signalRService';

export interface Booking {
  id: number;
  roomName: string;
  start: string;
  end: string;
  userEmail: string;
  status: string;
}

export interface BookingsResponse {
  items: Booking[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export function useBookings(page = 1, pageSize = 10) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📡 Fetching bookings: page ${page}, pageSize ${pageSize}`);
      
      const response = await apiClient.get(`/bookings/allbookings?page=${page}&pageSize=${pageSize}`);
      
      let items: Booking[] = [];
      let total = 0;
      
      if (response && response.items) {
        items = response.items;
        total = response.totalCount || 0;
      } else if (response && response.data && response.data.items) {
        items = response.data.items;
        total = response.data.totalCount || 0;
      } else if (Array.isArray(response)) {
        items = response;
        total = response.length;
      }
      
      setBookings(items);
      setTotalCount(total);
      
    } catch (err: any) {
      console.error(' Error fetching bookings:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.message === 'Network Error') {
        setError('Cannot connect to server. Please check your connection.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
      } else {
        setError(err.message || 'Failed to fetch bookings');
      }
      
      setBookings([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Cancel booking
  const cancelBooking = useCallback(async (id: number) => {
    try {
      console.log(` Cancelling booking: ${id}`);
      
      await apiClient.put(`/bookings/cancel/${id}`);
      
      console.log(' Booking cancelled successfully');
      await fetchBookings();
      
      return true;
    } catch (err: any) {
      console.error(' Failed to cancel booking:', err);
      
      if (err.response?.status === 404) {
        throw new Error('Booking not found');
      } else if (err.response?.status === 400) {
        throw new Error(err.response.data?.message || 'Cannot cancel this booking');
      } else {
        throw new Error('Failed to cancel booking');
      }
    }
  }, [fetchBookings]);

  // Create booking
  const createBooking = useCallback(async (bookingData: any) => {
    try {
      console.log(' Creating booking:', bookingData);
      
      const response = await apiClient.post('/Bookings/create', bookingData);
      
      console.log(' Booking created:', response);
      
      // The SignalR event will update the list automatically
      // But we'll also refresh to be safe
      await fetchBookings();
      
      return response;
    } catch (err: any) {
      console.error(' Error creating booking:', err);
      
      if (err.response?.status === 409) {
        throw new Error('This room is already booked for the selected time.');
      } else if (err.response?.status === 400) {
        throw new Error(err.response.data?.message || 'Invalid booking data');
      } else {
        throw new Error('Failed to create booking');
      }
    }
  }, [fetchBookings]);

  // SignalR integration
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Start SignalR connection
    signalRService.startConnection().catch(console.error);

    // Listen for new bookings
    signalRService.on('BookingCreated', (newBooking: Booking) => {
      console.log('📨 SignalR: New booking created', newBooking);
      setBookings(prev => {
        // Check if booking already exists
        const exists = prev.some(b => b.id === newBooking.id);
        if (exists) return prev;
        
        // Add to beginning of list
        return [newBooking, ...prev];
      });
      setTotalCount(prev => prev + 1);
    });

    // Listen for booking updates
    signalRService.on('BookingUpdated', (updatedBooking: Booking) => {
      console.log('📨 SignalR: Booking updated', updatedBooking);
      setBookings(prev => 
        prev.map(b => b.id === updatedBooking.id ? updatedBooking : b)
      );
    });

    // Listen for booking cancellations
    signalRService.on('BookingCancelled', (cancelledId: number) => {
      console.log('📨 SignalR: Booking cancelled', cancelledId);
      setBookings(prev => 
        prev.map(b => 
          b.id === cancelledId ? { ...b, status: 'Cancelled' } : b
        )
      );
    });

    // Cleanup on unmount
    return () => {
      signalRService.off('BookingCreated');
      signalRService.off('BookingUpdated');
      signalRService.off('BookingCancelled');
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { 
    bookings, 
    totalCount,
    loading, 
    error, 
    fetchBookings,
    cancelBooking,
    createBooking
  };
}