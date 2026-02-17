import { useState } from "react";
import  "./ConferenceBooking.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import BookingList from "./Components/BookingList";
import mockBookings from "./data/mockData";
import BookingForm from "./Components/BookingForm";

function App() {

 const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("bookings");
    return savedBookings ? JSON.parse(savedBookings) : mockBookings;
  });

 
  useState(() => {
    const savedBookings = localStorage.getItem("bookings");
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }
  });

  const handleAddBooking = (newBooking) => {
    setBookings((prevBookings) => {
      const updatedBookings = [...prevBookings, newBooking];
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      return updatedBookings;
    });
  }

  const handleCancelBooking = (id) => {
  setBookings((prev) =>
    prev.filter((booking) => booking.id !== id)
  );
};


  const totalBookings = bookings.length;

  return (
    <main className="appContainer">
      <Navbar/>

      <div className="gridContainer">
        <BookingList bookings={bookings}
         onCancel={handleCancelBooking} />
      </div>

      <BookingForm onAddBooking={handleAddBooking} />
      <p>Total Bookings: {totalBookings}</p>
      
      <Footer/>
    </main>
  );
}

export default App;
