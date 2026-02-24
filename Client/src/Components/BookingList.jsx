import BookingCard from "./BookingCard";
import "./BookingList.css";

function BookingList({ bookings = [], onCancel, formatDate }) {
  if (bookings.length === 0) {
    return (
      <div className="bookings-empty">
        <p>No bookings to display.</p>
      </div>
    );
  }

  return (
    <div className="bookings-grid">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          id={booking.id}
          roomName={booking.roomName}
          startDate={booking.startDate}
          endDate={booking.endDate}
          userName={booking.userName}
          status={booking.status}
          onCancel={onCancel}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

export default BookingList;