import { useState } from "react";
import  "./ConferenceBooking.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import BookingList from "./Components/BookingList";
import mockBookings from "./data/mockData";

function App() {
  const [bookings, setBookinigs] = useState(mockBookings);

  const addBooking = (newBooking) => {
    setBookinigs([bookings, newBooking]);
  }

  const totalBookings = bookings.length;

  return (
    <main className="appContainer">
      <Navbar/>

      

      <div className="gridContainer">
        <BookingList />
      </div>

      <p>Total Bookings: {totalBookings}</p>
      <Footer/>
    </main>
  );
}

export default App;
