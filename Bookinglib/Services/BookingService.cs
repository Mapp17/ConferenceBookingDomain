using Bookinglib.Logic;
using Bookinglib.Domain;
using Bookinglib.Persistence;

namespace Bookinglib.Services
{
    public class BookingService
{
    private readonly BookingFileStore _store;

    public BookingService(BookingFileStore store)
    {
        _store = store;
    }

    public async Task<IEnumerable<Booking>> CreateBookingAsync(BookingRequest request)
    {
        
        if (request.Start < DateTime.UtcNow.Date)
            throw new InvalidOperationException("Cannot create a booking for a past date.");

        
        var existingBookings = await _store.LoadAsync();
        if (existingBookings.Any(b => b.Start == request.Start && b.Room.Type == request.Room.Type))
            throw new InvalidOperationException("This room is already booked for the selected date.");

        
        var booking = new Booking(
            request.Room,
            request.Start,
            request.End);

        
        await _store.SaveAsync(new List<Booking> { booking });

        return  new List<Booking> { booking };;
    }

    public async Task<IReadOnlyList<Booking>> GetAllBookingsAsync()
    {
        var bookings = await _store.LoadAsync();
        return bookings.AsReadOnly().ToList();
    }

    public async Task<Booking> GetBookingAsync(int id)
        {
            var booking = await _store.GetBookingIdAsync(id);
            
            if (booking == null)
                throw new BookingConflictException($"Booking {id} not found");
            
            return booking;
        }
    
}

}
