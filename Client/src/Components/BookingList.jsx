import BookingCard from "./BookingCard";

function BookingList({ bookings = [], onCancel }) {
  if (bookings.length === 0) {
    return <p>No bookings available.</p>;
  }

  return (
    <>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          id={booking.id}
          roomName={booking.roomName}
          date={booking.date}
          userName={booking.userName}
          onCancel={onCancel}
        />
      ))}
    </>
  );
}

export default BookingList;

