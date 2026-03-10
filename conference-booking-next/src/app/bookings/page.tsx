'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '../../hooks/useBookings';
import BookingList from '../../components/BookingList';
import apiClient from '../../api/apiClient';

export default function BookingsPage() {
  const router = useRouter();
  const { bookings, loading, error, fetchBookings, cancelBooking } = useBookings(1, 10);

  // Redirect to login if no token
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await cancelBooking(id);
      // Bookings will auto-refresh via the hook
    } catch (err: any) {
      console.error('Failed to cancel booking:', err);
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => fetchBookings()}
            className="px-6 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
          <button
            onClick={() => fetchBookings()}
            className="px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">No bookings to display.</p>
            <p className="text-gray-400 text-sm mt-2">Create a new booking to get started.</p>
          </div>
        ) : (
          <BookingList bookings={bookings} onCancel={handleCancelBooking} />
        )}
      </div>
    </div>
  );
}