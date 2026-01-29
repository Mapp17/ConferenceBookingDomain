namespace ConferenceRoomBookingSystem
{
    

public class Booking
{
    //public int BookingId { get; set; }
    public ConferenceRoom Room { get; set; }
    public DateTime Start { get;}
    public DateTime End {get;}

    // public TimeSlot timeslot {get;}
    public BookingStatus Status { get; set; }
    //public string BookerName { get; set; }


    //private static readonly List<Booking> _bookings = new();
    //public List<ConferenceRoom> conferenceRooms = new();

    public Booking( ConferenceRoom room, DateTime start, DateTime end)
    {
        
        Room = room;
        Start = start;
        End = end;
        Status = BookingStatus.Pending;
        
    }

    /*public void Confirm()
    {
        if (Status != BookingStatus.Pending)
            throw new ConferenceBookingHandleException("Only pending bookings can be confirmed");
        if (!Room.IsAvailableFor(TimeSlot))
            throw new ConferenceBookingHandleException("Room is no longer available for this time slot");

        Status = BookingStatus.Confirmed;
    }*/

    public void Confirm()
    {
        Status = BookingStatus.Confirmed;
    }
    public void Cancel()
    {
        Status = BookingStatus.Cancelled;
    }

    /*public void Cancel()
    {
        if (Status == BookingStatus.Cancelled || Status == BookingStatus.Completed)
            throw new ConferenceBookingHandleException($"Cannot cancel booking in {Status} status");

        Room.RemoveBooking(this);
    }*/
    
}
}