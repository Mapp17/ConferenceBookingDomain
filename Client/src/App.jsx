
import { useState } from "react";
import Header from "./Components/Header";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import BookingList from "./Components/BookingList";
import BookingForm from "./Components/BookingForm";
import { useBookings } from "./hooks/useBookings";
import "./ConferenceBooking.css";

function App() {
  const { bookings, loading, error, totalCount, fetchBookings } = useBookings();
  const [category, setCategory] = useState("All");

  // --- Filter bookings by category (optional: only if your DTO has category) ---
  const filteredBookings =
    category === "All"
      ? bookings
      : bookings.filter((b) => b.category === category); // <-- remove or fix if DTO has no category

  // --- Add booking properly via state update ---
  const handleAddBooking = (newBooking) => {
    fetchBookings(); // optional: re-fetch from API after add
  };

  // --- Cancel booking properly via state update ---
  const handleCancelBooking = (id) => {
    // optional: call backend to cancel, then re-fetch
    fetchBookings();
  };

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
          <p className="total">Total Bookings: {totalCount}</p>
        </aside>

        <section className="loading-container d-flex flex-column align-items-center">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          )}

          {error && (
            <div className="errorBox">
              <p style={{ color: "red" }}>Backend Offline: {error}</p>
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