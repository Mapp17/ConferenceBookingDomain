public class ConferenceRoom
{
     public int RoomId { get; }
    public string Name { get;  }
    public RoomCapacity Capacity { get; init; }
    public RoomStatus roomStatus { get; set; }

    public ConferenceRoom(int roomId, string name, RoomCapacity capacity)
    {
        RoomId = roomId;
        Name = name;
        Capacity = capacity;
        roomStatus = RoomStatus.Available;
    }    


    private readonly List<Booking> _bookings = new();
    public IReadOnlyList<Booking> Bookings => _bookings.AsReadOnly();

    public bool IsAvailableFor(TimeSlot timeSlot)
    {
        // Room must be available
        if (roomStatus != RoomStatus.Available)
            return false;
        
        // Check for overlapping bookings
        var hasOverlappingBooking = _bookings.Any(b => 
            b.Status == BookingStatus.Confirmed && 
            b.TimeSlot.Overlaps(timeSlot));
        
        return !hasOverlappingBooking;
    }

    public void AddBooking(Booking booking)
    {
       _bookings.Add(booking);
    }
    public void RemoveBooking(Booking booking)
    { 
        _bookings.Remove(booking);
    }
    public void UpdateStatus(RoomStatus newStatus)
    {
        // Business rule: Can't make room unavailable if it has upcoming bookings
        if (newStatus != RoomStatus.Available && 
            _bookings.Any(b => b.Status == BookingStatus.Confirmed && b.TimeSlot.StartTime > DateTime.UtcNow))
        {
            throw new InvalidOperationException(
                "Cannot change room status with upcoming confirmed bookings");
        }

        roomStatus = newStatus;
    }
}