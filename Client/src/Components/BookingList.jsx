import BookingCard from "./BookingCard";
import mockBookings from "../data/mockData";

function BookingList()
{
    return (
        <>
            {mockBookings.map((booking) => (
                <BookingCard 
                    roomName={booking.roomName}
                    key={booking.id}
                    date={booking.date}
                    userName={booking.userName}
                />
            ))}
        </>
    );
}

export default BookingList;
