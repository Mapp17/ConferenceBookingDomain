'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookings } from '../../hooks/useBookings';
import BookingList from '../../components/BookingList';
import Sidebar from '../../components/Sidebar';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorDisplay from '../../components/ErrorDisplay';
import EmptyState from '../../components/EmptyState';
import RouteGuard from '../../components/RouteGuard';
import { useAuth } from '../../hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5151';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [apiUrl] = useState(API_URL);
  
  const { bookings, loading, error, fetchBookings } = useBookings(currentPage, 10);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleCancelBooking = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        fetchBookings();
      }
    } catch {
      console.error('Failed to cancel booking');
    }
  };

  const filteredBookings = statusFilter === 'All'
    ? bookings
    : bookings.filter((b: any) => b.status === statusFilter);

  const getStatusCount = (status: string) => {
    if (status === 'All') return bookings.length;
    return bookings.filter((b: any) => b.status === status).length;
  };

  if (loading) {
    return (
      <RouteGuard>
        <LoadingScreen />
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            getStatusCount={getStatusCount}
            apiUrl={apiUrl}
          />

          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800">Current Bookings</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 
                             hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-gray-600">Page {currentPage}</span>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 
                             hover:bg-gray-50 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            {error && (
              <ErrorDisplay error={error} onRetry={fetchBookings} />
            )}

            {!error && (
              <>
                {filteredBookings.length === 0 ? (
                  <EmptyState statusFilter={statusFilter} />
                ) : (
                  <BookingList
                    bookings={filteredBookings}
                    onCancel={handleCancelBooking}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}