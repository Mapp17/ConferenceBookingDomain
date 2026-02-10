using Bookinglib.Persistence;
using Microsoft.EntityFrameworkCore;  
using Bookinglib.Domain;  

namespace ConferenceBookingDomain.api.Persistence
{
    public class EFBookingStore : IBookingFileStore
    {
        private readonly BookingAppDbContext _context;

        public EFBookingStore(BookingAppDbContext context)
        {
            _context = context;
        }

        public async Task SaveAsync(IEnumerable<Booking> bookings)
        {
            await _context.Bookings.AddRangeAsync(bookings);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Booking>> LoadAsync()
        {
            return await _context.Bookings
                .Include(b => b.Room)
                .ToListAsync();
        }

        public async Task<Booking> GetBookingIdAsync(int id)
        {
            return await _context.Bookings
                .Include(b => b.Room)
                .FirstOrDefaultAsync(b => b.Id == id);
        }
    }
}