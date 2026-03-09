import { useState } from 'react';
import './ConferenceBooking.css';
import { useBookings } from './hooks/useBookings';
import { useAuth } from './hooks/useAuth';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import BookingList from './Components/BookingList';
import BookingForm from './Components/BookingForm';
import Footer from './Components/Footer';
import LoadingScreen from './Components/LoadingScreen';
import ErrorDisplay from './Components/ErrorDisplay';
import EmptyState from './Components/EmptyState';
import LoginForm from './Components/LoginForm';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  
  const { 
    bookings, 
    loading, 
    error: bookingsError, 
    createBooking, 
    cancelBooking 
  } = useBookings(currentPage, 10);
  
  const { 
    login, 
    logout, 
    error: authError, 
    isAuthenticated,
    user
  } = useAuth();

  // Filter bookings based on selected status
  const filteredBookings = statusFilter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  // Get count for each status filter
  const getStatusCount = (status) => {
    if (status === 'All') return bookings.length;
    return bookings.filter(b => b.status === status).length;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (id) => {
    try {
      await cancelBooking(id);
    } catch (err) {
      // Error handled in hook
    }
  };

  // Handle create booking
  const handleCreateBooking = async (bookingData) => {
    try {
      await createBooking(bookingData);
      setShowForm(false);
    } catch (err) {
      // Error handled in hook
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <LoginForm onLogin={login} error={authError} />
      </div>
    );
  }

  // Show loading screen while fetching data
  if (loading && bookings.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      {/* Navbar with user info and logout */}
      <Navbar onLogout={logout} />

      {/* Main layout with sidebar and content */}
      <div className="main-layout">
        {/* Sidebar with filters and connection status */}
        <Sidebar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          getStatusCount={getStatusCount}
          apiUrl={import.meta.env.VITE_API_BASE_URL || 'http://localhost:5151'}
        />

        {/* Main content area */}
        <main className="main-content">
          {/* Header with pagination */}
          <Header 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
          />

          {/* Error display if any */}
          {bookingsError && (
            <ErrorDisplay 
              error={bookingsError} 
              onRetry={() => window.location.reload()} 
            />
          )}

          {/* Booking list or empty state */}
          {!bookingsError && (
            <>
              {filteredBookings.length === 0 ? (
                <EmptyState statusFilter={statusFilter} />
              ) : (
                <BookingList
                  bookings={filteredBookings}
                  onCancel={handleCancelBooking}
                  formatDate={formatDisplayDate}
                />
              )}
              
              {/* Create booking button */}
              <div className="action-bar">
                <button
                  className="create-button"
                  onClick={() => setShowForm(true)}
                >
                  + New Booking
                </button>
              </div>

              {/* Booking form modal */}
              {showForm && (
                <BookingForm
                  onSubmit={handleCreateBooking}
                  onClose={() => setShowForm(false)}
                  error={bookingsError}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;