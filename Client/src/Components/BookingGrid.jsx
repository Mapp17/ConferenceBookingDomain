import BookingCard from "./BookingCard";


function BookingGrid({ bookings, onCancelBooking }) {
  return (
    <div className="bookings-grid">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          id={booking.id}
          roomName={booking.roomName}
          startDate={booking.start}
          endDate={booking.end}
          userName={booking.userEmail}
          status={booking.status}
          onCancel={onCancelBooking}
        />
      ))}
    </div>
  );
}

export default BookingGrid;