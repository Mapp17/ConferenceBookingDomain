import BookingCard from "./BookingCard";
import "../ConferenceBooking.css";

function BookingList({ bookings = [], onCancel, formatDate }) {
  return (
    <div className="bookings-grid">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          id={booking.id}
          roomName={booking.roomName}
          start={booking.start}
          end={booking.end}
          userEmail={booking.userEmail}
          status={booking.status}
          onCancel={onCancel}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

export default BookingList;