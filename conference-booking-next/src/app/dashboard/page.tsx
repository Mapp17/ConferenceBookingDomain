'use client';

import { useState, useEffect } from 'react';
import { useBookings } from '../../hooks/useBookings';
import BookingList from '../../components/BookingList';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import LoadingScreen from '../../components/LoadingScreen';
import ErrorDisplay from '../../components/ErrorDisplay';
import EmptyState from '../../components/EmptyState';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5151';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [apiUrl] = useState(API_URL);
  
  const { bookings, loading, error } = useBookings(currentPage, 10);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleCancelBooking = async (id: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        window.location.reload();
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
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          getStatusCount={getStatusCount}
          apiUrl={apiUrl}
        />

        <main className="flex-1">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {error && (
            <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
          )}

          {!error && (
            <>
              {filteredBookings.length === 0 ? (
                <EmptyState statusFilter={statusFilter} />
              ) : (
                <BookingList
                  bookings={bookings}
                  onCancel={handleCancelBooking}

                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}