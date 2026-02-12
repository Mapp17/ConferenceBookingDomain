using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Bookinglib.Domain;

public class EfBookingRepository : IBookingRepository
{
    private readonly BookingAppDbContext _context;

    public EfBookingRepository(BookingAppDbContext context)
    {
        _context = context;
    }

    public async Task AddBookingAsync(Booking booking)
    {
        await _context.Bookings.AddAsync(booking);
    }

    public async Task DeleteBookingAsync(Booking booking)
    {
         _context.Bookings.Remove(booking);
    }
    public async Task<Booking?> GetBookingByIdAsync(int id)
    {
        return await _context.Bookings.FindAsync(id).AsTask();
    }

    public async Task<List<Booking>> GetAllBookingsAsync()
    {
        return await _context.Bookings
            .Include(b => b.Room)
            .ToListAsync();
    }
    public IQueryable<Booking> GetAllBookingsAsQueryable()
    {
        return _context.Bookings.Include(b => b.Room).AsNoTracking();
    }


    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
