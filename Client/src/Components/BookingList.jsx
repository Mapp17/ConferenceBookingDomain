import BookingCard from "./BookingCard";

function BookingList({bookings, onCancel})
{
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
