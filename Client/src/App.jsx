import styles from "./ConferenceBooking.module.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Button from "./Components/Button";
import BookingCard from "./Components/BookingCard";
import mockBookings from "./mockData";

function App() {
  return (
    <div className={styles.appContainer}>
      <Navbar className={styles.navbar} />

      <div className={styles.gridContainer}>
        {mockBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            className={styles.bookingCard}
            roomName={booking.roomName}
            date={booking.date}
            userName={booking.userName}
          />
        ))}
      </div>

      <Footer className={styles.footer} />
    </div>
  );
}

export default App;
