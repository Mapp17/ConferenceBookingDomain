using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Bookinglib.Domain;

public class EfRoomRepository : IRoomRepository
{
    private readonly BookingAppDbContext _context;

    public EfRoomRepository(BookingAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ConferenceRoom>> GetAllRoomsAsync()
    {
        return await _context.ConferenceRooms.ToListAsync();
    }

    public async Task<ConferenceRoom?> GetRoomByIdAsync(int id)
    {
        return await _context.ConferenceRooms.FindAsync(id).AsTask();
    }

    public async Task<List<ConferenceRoom>> GetAvailableRoomsAsync(DateTime start, DateTime end)
    {
        return await _context.ConferenceRooms
            .Where(r => !_context.Bookings
                .Any(b => 
                          b.Start < end && b.End > start))
            .ToListAsync();
    }
}
