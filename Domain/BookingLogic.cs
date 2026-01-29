using System.Text.Json;

public class BookingLogic
{
    private readonly Dictionary<int, ConferenceRoom> _rooms;
    private readonly Dictionary<int, Booking> _bookings = new();
    private readonly List<Booking> _bookingList = new();

    public BookingLogic(IEnumerable<ConferenceRoom> rooms)
    {
        _rooms = rooms?.ToDictionary(r => r.RoomId) 
            ?? throw new ConferenceBookingHandleException("Rooms collection cannot be null");
    }


    public BookingRequestResult RequestBooking(int roomId, TimeSlot timeSlot, string bookerName)
    {
        
        if (!_rooms.TryGetValue(roomId, out var room))
        {
            return BookingRequestResult.Failure($"Room with ID {roomId} does not exist");
        }
        
        if (!room.IsAvailableFor(timeSlot))
        {
            return BookingRequestResult.Failure($"Room '{room.Name}' is not available for the requested time slot");
        }
        
        
        if ((timeSlot.EndTime - timeSlot.StartTime).TotalHours < 0.5)
        {
            return BookingRequestResult.Failure("Minimum booking duration is 30 minutes");
        }
        

        var bookingId = _bookings.Count + 1;
        var booking = new Booking(bookingId, room, timeSlot, bookerName);
        

        _bookings.Add(bookingId, booking);
        _bookings[bookingId] = booking;
        room.AddBooking(booking);
        
        return BookingRequestResult.Success(booking);
    }

    public List<ConferenceRoom> GetAvailableRooms(TimeSlot timeSlot)
    {
        return _rooms.Values
            .Where(room => room.IsAvailableFor(timeSlot))
            .ToList();
    }

    public List<ConferenceRoom> GetAvailableRooms(TimeSlot timeSlot, int minCapacity)
    {
        return _rooms.Values
            .Where(room => room.roomStatus == RoomStatus.Available)
            .Where(room => room.Capacity.Value >= minCapacity)
            .Where(room => !room.Bookings.Any(b => 
                b.Status == BookingStatus.Confirmed && 
                b.TimeSlot.Overlaps(timeSlot)))
            .ToList();
    }

        public List<Booking> GetUpcomingBookings()
    {
        return _bookings.Values
            .Where(b => b.Status == BookingStatus.Confirmed)
            .Where(b => b.TimeSlot.StartTime > DateTime.UtcNow)
            .OrderBy(b => b.TimeSlot.StartTime)
            .ToList();
    }

    public bool HasDoubleBooking(ConferenceRoom room, TimeSlot timeSlot)
    {
        return room.Bookings.Any(b => 
            b.Status == BookingStatus.Confirmed && 
            b.TimeSlot.Overlaps(timeSlot));
    }

    public bool IsBookingRequestValid(int roomId, TimeSlot timeSlot, out string errorMessage)
    {
        errorMessage = string.Empty;
        
        if (!_rooms.TryGetValue(roomId, out var room))
        {
            errorMessage = $"Room with ID {roomId} does not exist";
            return false;
        }

        if (room.roomStatus != RoomStatus.Available)
        {
            errorMessage = $"Room '{room.Name}' is {room.roomStatus}";
            return false;
        }
        

        if (HasDoubleBooking(room, timeSlot))
        {
            errorMessage = $"Room '{room.Name}' is already booked for overlapping time";
            return false;
        }
        
        return true;
    }
    public bool ConfirmBooking(int bookingId)
    {
        if (!_bookings.TryGetValue(bookingId, out var booking))
            return false;
        
        try
        {
            booking.Confirm();
            return true;
        }
        catch (ConferenceBookingHandleException)
        {
            return false;
        }
    }

    public bool CancelBooking(int bookingId)
    {
        if (!_bookings.TryGetValue(bookingId, out var booking))
            return false;
        
        try
        {
            booking.Cancel();
            _bookings.Remove(bookingId);
            return true;
        }
        catch (ConferenceBookingHandleException)
        {
            return false;
        }
    }

    public async Task SaveBookingsAsync(string filePath)
    {
        filePath = "C:\\Users\\USER\\Desktop\\BitCube\\ConferenceBookingDomain\\Domain\\bookings.json";
        List<Booking> existingBookings = _bookingList.ToList();
        string json = JsonSerializer.Serialize(existingBookings);
        await File.WriteAllTextAsync(filePath, json);
    }

    public async Task<List<Booking>> LoadBookingsAsync(string filePath)
    {
        filePath = "C:\\Users\\USER\\Desktop\\BitCube\\ConferenceBookingDomain\\Domain\\bookings.json";
        if (!File.Exists(filePath))
            return new List<Booking>();
        
        string json = await File.ReadAllTextAsync(filePath);
        var bookings = JsonSerializer.Deserialize<List<Booking>>(json);
        return bookings ?? new List<Booking>();
    }
    

    public List<ConferenceRoom> GetAllRooms() => _rooms.Values.ToList();
        
        public ConferenceRoom? GetRoomById(int roomId) => _rooms.TryGetValue(roomId, out var room) ? room : null;
        
        public List<Booking> GetAllBookings() => _bookingList;
        
        public Booking? GetBookingById(int bookingId) => _bookings.TryGetValue(bookingId, out var booking) ? booking : null;
        
        

public record BookingRequestResult(bool IsSuccess, Booking? Booking, string ErrorMessage)
{
    public static BookingRequestResult Success(Booking booking) 
        => new(true, booking, string.Empty);
    
    public static BookingRequestResult Failure(string error) 
        => new(false, null, error);
}
}