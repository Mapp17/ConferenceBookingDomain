using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Bookinglib.Domain;
using api.DTOs;
using api.Common;


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
        booking.IsDeleted = true;
        _context.Bookings.Update(booking);
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
        var room = await _context.ConferenceRooms
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(r => r.Id == request.RoomId);

        if (room == null)
            throw new Exception("Room does not exist.");

        if (!room.IsActive)
            throw new Exception("Room is inactive.");

        if (request.Start >= request.End)
            throw new Exception("Invalid time range.");

        var overlap = await _context.Bookings.AnyAsync(b =>
            b.RoomId == request.RoomId &&
            request.Start < b.End &&
            request.End > b.Start);

        if (overlap)
            throw new Exception("Room already booked.");

        var booking = new Booking(request.RoomId, request.UserId,
                                request.Start, request.End);

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        return new BookingResponseDto
    {
        RoomId = booking.RoomId,
        RoomName = room.Name,
        Capacity = room.Capacity,
        Start = booking.Start,
        End = booking.End,
        Status = booking.Status.ToString(),
        CreatedAt = booking.CreatedAt,
        CancelledAt = booking.CancelledAt
    };
    }

    public async Task<PaginatedResult<BookingListResponseDto>> GetPagedAsync(int page, int pageSize)
    {
        var query = _context.Bookings
            .AsNoTracking();

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(b => b.Start)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(b => new BookingListResponseDto
            {
                Id = b.Id,
                RoomName = b.Room.Name,
                Start = b.Start,
                End = b.End,
                Status = b.Status.ToString()
            })
            .ToListAsync();

        return new PaginatedResult<BookingListResponseDto>(items, total);
    }
    
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
