import { useState, useEffect } from "react";
import "./ConferenceBooking.css";

const API_URLS = [
  "https://localhost:5151",
  "http://localhost:5151"

];

function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiUrl, setApiUrl] = useState(API_URLS[0]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const pageSize = 10;

  const testApiConnection = async () => {
    setIsTestingConnection(true);
    
    for (const url of API_URLS) {
      try {
        const testUrl = `${url}/api/bookings/allbookings?page=1&pageSize=1`;
        const response = await fetch(testUrl, { 
          method: 'GET',
          mode: 'cors',
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          setApiUrl(url);
          setIsTestingConnection(false);
          fetchBookings(url);
          return;
        }
      } catch {
        continue;
      }
    }
    
    setError("Unable to connect to the booking service.");
    setIsTestingConnection(false);
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  useEffect(() => {
    if (apiUrl) {
      fetchBookings();
    }
  }, [currentPage, apiUrl]);

  const fetchBookings = async (urlToUse = apiUrl) => {
    setLoading(true);
    
    try {
      const url = `${urlToUse}/api/bookings/allbookings?page=${currentPage}&pageSize=${pageSize}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`Unable to fetch bookings: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data.items || []);
      setError(null);
    } catch {
      setError("Failed to load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Date not available";
    
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
      return "Invalid date";
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        fetchBookings();
      }
    } catch {
      setError("Failed to cancel booking.");
    }
  };

  const filteredBookings = statusFilter === "All" 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const getStatusCount = (status) => {
    if (status === "All") return bookings.length;
    return bookings.filter(b => b.status === status).length;
  };

  if (isTestingConnection) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h2>Conference Booking System</h2>
          <p>Connecting to service...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>Conference Booking System</h1>
          <p className="header-description">Manage and track all room bookings</p>
        </div>
        <div className="connection-badge">
          <span className="status-dot"></span>
          <span className="connection-text">Connected</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Filters</h3>
            <div className="filter-list">
              {["All", "Pending", "Confirmed"].map((filter) => (
                <button
                  key={filter}
                  className={`filter-button ${statusFilter === filter ? 'active' : ''}`}
                  onClick={() => setStatusFilter(filter)}
                >
                  <span>{filter}</span>
                  <span className="filter-count">{getStatusCount(filter)}</span>
                </button>
              ))}
            </div>
          </div>

          

          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Info</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">API Status</span>
                <span className="info-value online">Online</span>
              </div>
              <div className="info-item">
                <span className="info-label">Endpoint</span>
                <span className="info-value endpoint">{apiUrl}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Page Header */}
          <div className="page-header">
            <h2 className="page-title">Current Bookings</h2>
            <div className="pagination-controls">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ← Previous
              </button>
              <span className="page-indicator">Page {currentPage}</span>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                className="pagination-button"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Content Area */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button onClick={testApiConnection} className="retry-button">
                Retry Connection
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredBookings.length === 0 ? (
                <div className="empty-state">
                  <h3>No Bookings Found</h3>
                  <p>No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} bookings to display.</p>
                </div>
              ) : (
                <div className="bookings-grid">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="card-header">
                        <h4 className="room-name">{booking.roomName}</h4>
                        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="card-body">
                        <div className="datetime-group">
                          <div className="datetime-item">
                            <span className="datetime-label">Start</span>
                            <span className="datetime-value">{formatDisplayDate(booking.start)}</span>
                          </div>
                          <div className="datetime-item">
                            <span className="datetime-label">End</span>
                            <span className="datetime-value">{formatDisplayDate(booking.end)}</span>
                          </div>
                        </div>

                        <div className="booker-info">
                          <span className="booker-label">Booked by</span>
                          <span className="booker-value">{booking.userEmail}</span>
                        </div>
                      </div>

                      {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                        <div className="card-footer">
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="cancel-button"
                          >
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2024 Conference Booking System. All rights reserved.</p>
          <p className="footer-version">Version 1.0.0</p>
        </div>
      </footer>
    </div>
  );
}

export default App;