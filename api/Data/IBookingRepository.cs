using Bookinglib.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
public interface IBookingRepository
{
    Task AddBookingAsync(Booking booking);
    Task DeleteBookingAsync(Booking booking);
    Task<Booking?> GetBookingByIdAsync(int id);
    Task<List<Booking>> GetAllBookingsAsync();
    Task SaveChangesAsync();
}
