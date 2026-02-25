import { useEffect, useState } from "react";
import Header from "./Components/Header";
import "./ConferenceBooking.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import BookingList from "./Components/BookingList";
import BookingForm from "./Components/BookingForm";
import { fetchAllBookings } from "./services/bookingService";

function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");

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
  };

  const totalBookings = bookings.length;

  return (
    <main className="appContainer">
      <Navbar />
      <Header />

      <div className="dashboard">
        <aside className="sidebar d-flex flex-column">
          <h2>Filters</h2>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filterSelect"
          >
            <option>All</option>
            <option>Internal</option>
            <option>Client</option>
          </select>

          
          <p className="total">Total Bookings: {totalBookings}</p>
        </aside>

        <section className="loading-container d-flex flex-column align-items-center">
          {loading && <div className="loading-spinner"><div className="spinner"></div></div>}
          {error && (
            <div className="errorBox">
              <p>{error}</p>
              <button onClick={loadBookings}>Retry</button>
            </div>
          )}
          {!loading && !error && (
            <div className="gridContainer">
            <BookingList 
              bookings={filteredBookings}
              onCancel={handleCancelBooking}
            />
            </div>
          )}
          <BookingForm onAddBooking={handleAddBooking} />
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default App;