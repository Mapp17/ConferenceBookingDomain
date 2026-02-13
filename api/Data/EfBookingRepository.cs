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

    public async Task<BookingResponseDto> CreateAsync(CreateBookingRequestDto request)
    {
        var room = await _context.Rooms
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(r => r.Id == request.RoomId);

        if (room == null)
            throw new Exception("Room does not exist.");

        if (!room.IsActive)
            throw new Exception("Room is inactive.");

        if (request.StartTime >= request.EndTime)
            throw new Exception("Invalid time range.");

        var overlap = await _context.Bookings.AnyAsync(b =>
            b.RoomId == request.RoomId &&
            request.StartTime < b.EndTime &&
            request.EndTime > b.StartTime);

        if (overlap)
            throw new Exception("Room already booked.");

        var booking = new Booking(request.RoomId, request.UserId,
                                request.StartTime, request.EndTime);

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return new BookingResponseDto(booking.Id);
    }



    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
