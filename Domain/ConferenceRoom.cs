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

        if (roomStatus != RoomStatus.Available)
            return false;
        
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
        
        if (newStatus != RoomStatus.Available && 
            _bookings.Any(b => b.Status == BookingStatus.Confirmed && b.TimeSlot.StartTime > DateTime.UtcNow))
        {
            throw new ConferenceBookingHandleException($"Cannot change status to {newStatus} while there are upcoming confirmed bookings.");
        }

        roomStatus = newStatus;
    }
}