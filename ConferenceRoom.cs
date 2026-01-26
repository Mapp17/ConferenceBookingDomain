public record ConferenceRoom
{
    public string Name { get; init; }
    public RoomCapacity Capacity { get; init; }
    public BookingStatus Status { get; set; }
    private readonly List<Booking> _bookings = new();
 

    public ConferenceRoom(string name, RoomCapacity capacity)
    {
        Name = name;
        Capacity = capacity;
        Status = BookingStatus.Available;
    }

    public bool IsAvailableFor(TimeSlot timeSlot)
    {
        if (Status != BookingStatus.Available)
            return false;
        
        return true;
    }

    public void AddBooking(Booking booking)
    {
       _bookings.Add(booking);
    }

    internal void RemoveBooking(Booking booking)
    { 
        _bookings.Remove(booking);
    }
}