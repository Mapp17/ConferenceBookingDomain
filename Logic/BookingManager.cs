namespace ConferenceRoomBookingSystem
{
    
public class BookingManager // business rules should be here
{
    //Properties
    private readonly List<Booking> _bookings;     


    // Methods
    public IReadOnlyList<Booking> GetBookings()
    {
        return _bookings.ToList();
    }

    public Booking CreateBooking(BookingRequest bookingRequest)
    {
        // Guard Clauses
        if(bookingRequest.Room != null)
            throw new ArgumentException("Room must exits");
        else if(bookingRequest.Start >= bookingRequest.End)
            throw new ArgumentException("Invalid time range");

        bool overlaps = _bookings.Any(b => b.Room == bookingRequest.Room &&
                            b.Status == BookingStatus.Confirmed &&
                            bookingRequest.Start < b.End && bookingRequest.End > bookingRequest.Start);
        
        if(overlaps)
        {
            throw new BookingConflictException();
        }

        Booking booking = new Booking(bookingRequest.Room, bookingRequest.Start, bookingRequest.End);
        booking.Confirm();
        _bookings.Add(booking);

        return booking;

    }


}}