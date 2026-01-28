public class Booking
{
    public int BookingId { get; set; }
    public static ConferenceRoom Room { get; set; }
    public TimeSlot TimeSlot { get;}
    public BookingStatus Status { get; set; }
    public string BookerName { get; set; }


    private static readonly List<Booking> _bookings = new();
    public List<ConferenceRoom> conferenceRooms = new();

    public Booking(int bookingId, ConferenceRoom room, TimeSlot timeSlot, string bookerName)
    {
        BookingId = bookingId;
        Room = room;
        TimeSlot = timeSlot;
        Status = BookingStatus.Pending;
        BookerName = bookerName;
    }

    public void Confirm()
    {
        if (Status != BookingStatus.Pending)
            throw new InvalidOperationException($"Cannot confirm booking in {Status} status");
        
        if (!Room.IsAvailableFor(TimeSlot))
            throw new InvalidOperationException("Room is no longer available for this time slot");
        
        Status = BookingStatus.Confirmed;
    }

    public void Cancel()
    {
        if (Status == BookingStatus.Cancelled || Status == BookingStatus.Completed)
            throw new InvalidOperationException($"Cannot cancel booking in {Status} status");

        Room.RemoveBooking(this);
    }
    
}