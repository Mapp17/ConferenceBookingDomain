'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import apiClient from '../api/apiClient';
import { useAuth } from '../hooks/useAuth';
import * as signalR from '@microsoft/signalr';

interface Room {
  id: number;
  roomName: string;
  capacity: number;
  roomType: string;
}

interface BookingFormProps {
  onBookingCreated?: (booking: any) => void;
  onClose?: () => void;
}

export default function BookingForm({ onBookingCreated, onClose }: BookingFormProps) {
  const { user, isAuthenticated } = useAuth();
  
  const [roomId, setRoomId] = useState<number>(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  // SignalR connection state
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [signalRConnected, setSignalRConnected] = useState(false);

  // Initialize SignalR connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5151';
    
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/bookings`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Start SignalR connection
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log(' SignalR connected for real-time updates');
          setSignalRConnected(true);
          
          // Listen for booking events
          connection.on('BookingCreated', (newBooking) => {
            console.log(' SignalR - New booking received:', newBooking);
          });
          
          connection.on('BookingUpdated', (updatedBooking) => {
            console.log(' SignalR - Booking updated:', updatedBooking);
          });
          
          connection.on('BookingCancelled', (cancelledId) => {
            console.log(' SignalR - Booking cancelled:', cancelledId);
          });
        })
        .catch(err => {
          console.error(' SignalR connection error:', err);
          setSignalRConnected(false);
        });

      return () => {
        connection.off('BookingCreated');
        connection.off('BookingUpdated');
        connection.off('BookingCancelled');
      };
    }
  }, [connection]);

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log(' Fetching rooms...');
        const response = await apiClient.get('/rooms');
        console.log(' Rooms fetched:', response);
        setRooms(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error(' Failed to fetch rooms:', err);
        setError('Failed to load rooms. Please refresh the page.');
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, []);

  const clearForm = () => {
    setRoomId(0);
    setStartTime('');
    setEndTime('');
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (!roomId || roomId === 0) {
      setError('Please select a room');
      return false;
    }
    if (!user || !user.id) {
      setError('You must be logged in to create a booking');
      return false;
    }
    if (!startTime) {
      setError('Start time is required');
      return false;
    }
    if (!endTime) {
      setError('End time is required');
      return false;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      setError('Start time cannot be in the past');
      return false;
    }

    if (end <= start) {
      setError('End time must be after start time');
      return false;
    }

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours > 8) {
      setError('Booking cannot exceed 8 hours');
      return false;
    }

    if (durationHours < 0.5) {
      setError('Booking must be at least 30 minutes');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user || !user.id) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);
      
      // Format exactly as API expects
      const bookingData = {
        roomId: roomId,      // Selected room ID
        userId: user.id,      // Logged-in user ID
        start: startDate.toISOString(),
        end: endDate.toISOString()
      };

      console.log(' Creating booking with data:', bookingData);
      
      // Make the API call
      const response = await apiClient.post('/Bookings/create', bookingData);
      
      console.log(' Booking created successfully:', response);
      
      // Notify via SignalR if connected
      if (signalRConnected && connection) {
        try {
          await connection.send('NotifyBookingCreated', response);
          console.log(' SignalR notification sent');
        } catch (signalRError) {
          console.error(' SignalR notification failed:', signalRError);
        }
      }
      
      setSuccess('Booking created successfully!');
      
      if (onBookingCreated) {
        onBookingCreated(response);
      }
      
      clearForm();
      
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
      
    } catch (err: any) {
      console.error(' Error creating booking:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.title ||
                          JSON.stringify(err.response?.data) ||
                          err.message;
      
      setError(`Failed to create booking: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">You must be logged in to create a booking.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Booking</h2>

      
      {/* User Info */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Booking as</p>
            <p className="font-semibold">{user?.username}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Your User ID</p>
            <p className="text-lg font-bold text-primary-600">{user?.id}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Selection - Shows actual Room IDs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Room <span className="text-red-500">*</span>
          </label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            required
            disabled={loading || loadingRooms}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:bg-gray-100"
          >
            <option value={0}>-- Choose a room --</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                Room #{room.id}: {room.roomName} (Capacity: {room.capacity}) - {room.roomType}
              </option>
            ))}
          </select>
          {loadingRooms && (
            <p className="text-xs text-gray-500 mt-1">Loading rooms...</p>
          )}
          
          {/* Show selected room ID for confirmation */}
          {roomId > 0 && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Selected Room ID: {roomId}
            </p>
          )}
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            min={getCurrentDateTime()}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            min={startTime || getCurrentDateTime()}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={clearForm}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading || roomId === 0}
            className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-primary-500 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Creating...' : 'Create Booking'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Debug preview */}
      {roomId > 0 && startTime && endTime && user && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs font-mono text-gray-600">
            <strong>Preview:</strong><br/>
            {`{ roomId: ${roomId}, userId: ${user.id}, start: "${new Date(startTime).toISOString()}", end: "${new Date(endTime).toISOString()}" }`}
          </p>
        </div>
      )}
    </div>
  );
}