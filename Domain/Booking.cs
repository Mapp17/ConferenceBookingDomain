public class Booking
{
    public ConferenceRoom Room { get; set; }
    public TimeSlot TimeSlot { get;}
    public string BookerName { get; set; }

    public Booking(ConferenceRoom room, TimeSlot timeSlot, string bookerName)
    {
        Room = room;
        TimeSlot = timeSlot;
        BookerName = bookerName;
        Room.AddBooking(this);
    }

    public void CancelBooking()
    {
        Room.RemoveBooking(this);
    }


    public static Booking Create(ConferenceRoom room, TimeSlot timeSlot, string bookedBy)
    {
        if (!room.IsAvailableFor(timeSlot))
            throw new InvalidOperationException($"Room '{room.Name}' is not available for the requested time slot");
        
        var booking = new Booking(room, timeSlot, bookedBy);
        room.AddBooking(booking);
        return booking;
    }




}