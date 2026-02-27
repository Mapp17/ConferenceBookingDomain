import { useState, useEffect } from "react";
import BookingList from "./Components/BookingList";
import "./ConferenceBooking.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar"
import EmptyState from "./Components/EmptyState";
import { useBookings } from "./hooks/useBookings";
import LoadingScreen from "./Components/LoadingScreen";
import ErrorDisplay from "./Components/ErrorDisplay";
import Header from "./Components/Header";


const API_URLS = [
  "http://localhost:5151"

];

function App() {
  const [apiUrl, setApiUrl] = useState(API_URLS[0]);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const pageSize = 10;
  const { bookings, loading, error } = useBookings(currentPage, 10);

<<<<<<< HEAD
  const loadBookings = () => {
    setLoading(true);
    setError(null);
    fetchAllBookings()
      .then((data) => {
        setBookings(data);
        localStorage.setItem("bookings", JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };


  useEffect(() => {
    loadBookings();
  }, [category]); 


  const filteredBookings =
    category === "All"
      ? bookings
      : bookings.filter((b) => b.category === category);

  
  const handleAddBooking = (newBooking) => {
    setBookings((prevBookings) => {
      const updatedBookings = [...prevBookings, newBooking];
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      return updatedBookings;
    });
  };

  
  const handleCancelBooking = (id) => {
    setBookings((prev) => {
      const updated = prev.filter((booking) => booking.id !== id);
      localStorage.setItem("bookings", JSON.stringify(updated));
      return updated;
    });
=======
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
          return;
        }
      } catch {
        continue;
      }
    }
    

    setIsTestingConnection(false);
  };

  useEffect(() => {
    testApiConnection();
  }, []);



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
>>>>>>> 4ca33a4ac88a6510e60e6eac02a2199d02ebe3e5
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
      <Navbar/>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <Sidebar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          getStatusCount={(status) =>{
            if (status === "All") return bookings.length;
            return bookings.filter(b => b.status === status).length;
          } }   
          apiUrl="http://localhost:5151/api"
        />

        {/* Main Content */}
        <main className="main-content">
          {/* Page Header */}
         <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {/* Content Area */}
          {loading && (
            <LoadingScreen />
          )}

          {error && (
            <ErrorDisplay error={error} onRetry={() => testApiConnection()} />
          )}

          {!loading && !error && (
            <>
              {filteredBookings.length === 0 ? (
                <EmptyState  statusFilter={statusFilter}/>
              ) : (
                <div>
                    <BookingList
                      bookings={filteredBookings}
                      onCancel={handleCancelBooking}
                      formatDate={formatDisplayDate}
                    />
                </div>
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