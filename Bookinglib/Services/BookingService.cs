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

    public async Task<Booking> CreateBookingAsync(BookingRequest request)
    {
        // Validate booking date
        if (request.Date < DateTime.UtcNow.Date)
            throw new InvalidOperationException("Cannot create a booking for a past date.");

        // Check for duplicate booking
        var existingBookings = await _store.LoadAsync();
        if (existingBookings.Any(b => b.Date == request.Date && b.RoomNumber == request.RoomNumber))
            throw new InvalidOperationException("This room is already booked for the selected date.");

        // Create booking
        var booking = new Booking(
            request.CustomerName,
            request.Date,
            request.RoomNumber);

        // Save booking
        await _store.SaveAsync(booking);

        return booking;
    }

    public Task<IReadOnlyList<Booking>> GetAllBookingsAsync()
    {
        return _store.LoadAsync();
    }
}

}
