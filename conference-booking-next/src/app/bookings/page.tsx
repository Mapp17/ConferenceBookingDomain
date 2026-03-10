'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '../../hooks/useBookings';
import BookingList from '../../components/BookingList';
import BookingForm from '../../components/BookingForm';
import * as signalR from '@microsoft/signalr';
import RouteGuard from '../../components/RouteGuard';
import { useAuth } from '../../hooks/useAuth';

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'info' | 'warning'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className={`fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn z-50`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:text-gray-200">✕</button>
    </div>
  );
};

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [signalRStatus, setSignalRStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; type: 'success' | 'info' | 'warning' }>>([]);
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBookings(1, 10);

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5151'}/hubs/bookings`, {
        accessTokenFactory: () => token || ''
      })
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        setSignalRStatus('connecting');
        await connection.start();
        setSignalRStatus('connected');
        addNotification('Connected to real-time updates', 'success');

        connection.on('BookingCreated', (newBooking) => {
          addNotification(`New booking: ${newBooking.roomName}`, 'success');
          fetchBookings();
        });

        connection.on('BookingUpdated', (updatedBooking) => {
          addNotification(`Booking updated: ${updatedBooking.roomName}`, 'info');
          fetchBookings();
        });

        connection.on('BookingCancelled', (cancelledId) => {
          addNotification(`Booking cancelled`, 'warning');
          fetchBookings();
        });

      } catch {
        setSignalRStatus('disconnected');
        addNotification('Failed to connect to real-time updates', 'warning');
      }
    };

    startConnection();

    connection.onreconnecting(() => {
      setSignalRStatus('connecting');
      addNotification('Reconnecting...', 'info');
    });

    connection.onreconnected(() => {
      setSignalRStatus('connected');
      addNotification('Reconnected', 'success');
      fetchBookings();
    });

    connection.onclose(() => {
      setSignalRStatus('disconnected');
      addNotification('Disconnected', 'warning');
    });

    return () => {
      connection.stop();
    };
  }, [isAuthenticated, router, fetchBookings]);

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      addNotification('Booking cancelled', 'success');
    } catch {
      addNotification('Failed to cancel booking', 'warning');
    }
  };

  if (loading) {
    return (
      <RouteGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading bookings...</p>
          </div>
        </div>
      </RouteGuard>
    );
  }

  if (error) {
    return (
      <RouteGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchBookings} className="px-4 py-2 bg-primary-400 text-white rounded">
              Try Again
            </button>
          </div>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {notifications.map(n => (
            <Toast key={n.id} message={n.message} type={n.type} onClose={() => setNotifications(prev => prev.filter(t => t.id !== n.id))} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Bookings</h1>
              <div className="px-3 py-1 bg-white rounded-full border flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  signalRStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                  signalRStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-600">{signalRStatus}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                {showForm ? 'Hide' : '+ New Booking'}
              </button>
              <button onClick={fetchBookings} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Refresh
              </button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8">
              <BookingForm onBookingCreated={() => addNotification('Booking created', 'success')} onClose={() => setShowForm(false)} />
            </div>
          )}

          {bookings.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border text-center">
              <p className="text-gray-500">No bookings</p>
              <p className="text-gray-400 text-sm mt-2">Click "New" to create one</p>
            </div>
          ) : (
            <BookingList bookings={bookings} onCancel={handleCancelBooking} />
          )}
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </RouteGuard>
  );
}