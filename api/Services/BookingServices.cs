// Services/BookingService.cs
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Bookinglib.Domain;
using api.DTOs;
using api.Common;


namespace api.Services
{


    public class BookingService : IBookingService
    {
        private readonly BookingAppDbContext _context;

        public BookingService(BookingAppDbContext context)
        {
            _context = context;
        }

        public async Task<BookingResponseDto> CreateBookingAsync(CreateBookingRequestDto request, int userId)
        {

            var room = await _context.ConferenceRooms
                .FirstOrDefaultAsync(r => r.Id == request.RoomId);

            if (room == null)
                throw new InvalidOperationException("Room not found");

            if (!room.IsActive)
                throw new InvalidOperationException("Room is inactive and cannot be booked");

            if (request.Start >= request.End)
                throw new InvalidOperationException("Start time must be before end time");


            if (request.Start.Hour < 8 || request.End.Hour > 20 || request.End.Hour < 8)
                throw new InvalidOperationException("Bookings are only allowed between 8 AM and 8 PM");


            var overlappingBooking = await _context.Bookings
                .AnyAsync(b => b.RoomId == request.RoomId &&
                              b.IsActive &&
                              b.Status != BookingStatus.Cancelled &&
                              request.Start < b.End &&
                              request.End > b.Start);

            if (overlappingBooking)
                throw new InvalidOperationException("Room is already booked for the selected time");

            var booking = new Booking(request.RoomId, userId, request.Start, request.End);

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return new BookingResponseDto
            {
                RoomId = booking.Id,
                RoomName = room.Name,
                RoomType = room.Type,
                Start = booking.Start,
                End = booking.End,
                Capacity = room.Capacity,
                Status = booking.Status.ToString()
            };
        }

        public async Task<bool> CancelBookingAsync(int bookingId)
        {
            var booking = await _context.Bookings
                .FirstOrDefaultAsync(b => b.Id == bookingId && b.IsActive);

            if (booking == null)
                return false;

            booking.Status = BookingStatus.Cancelled;
            booking.CancelledAt = DateTime.UtcNow;
            booking.IsActive = false;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PaginatedResult<BookingListResponseDto>> GetUserBookingsAsync(
            int userId, int page, int pageSize)
        {
            var query = _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .Where(b => b.UserId == userId && b.IsActive)
                .OrderByDescending(b => b.Start);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookingListResponseDto
                {
                    Id = b.Id,
                    RoomName = b.Room.Name,
                    UserEmail = b.User.Email,
                    Start = b.Start,
                    End = b.End,
                    Status = b.Status.ToString()
                })
                .ToListAsync();

            return new PaginatedResult<BookingListResponseDto>(items, totalCount, page, pageSize);
        }

        public async Task<PaginatedResult<BookingListResponseDto>> GetAllBookingsAsync(int page, int pageSize)
        {
            var query = _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .Where(b => b.IsActive);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(b => b.Start)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookingListResponseDto
                {
                    Id = b.Id,
                    RoomName = b.Room.Name,
                    UserEmail = b.User.Email,
                    Start = b.Start,
                    End = b.End,
                    Status = b.Status.ToString()
                })
                .ToListAsync();

            return new PaginatedResult<BookingListResponseDto>(items, totalCount, page, pageSize);
        }

        public async Task<List<BookingListResponseDto>> GetFilteredBookingsAsync(
            string? roomName,
            DateTime? startDate,
            DateTime? endDate,
            string? status)
        {
            var query = _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(roomName))
                query = query.Where(b => b.Room.Name.Contains(roomName));

            if (startDate.HasValue)
                query = query.Where(b => b.Start >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(b => b.End <= endDate.Value);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(b => b.Status.ToString() == status);

            return await query
                .Select(b => new BookingListResponseDto
                {
                    Id = b.Id,
                    RoomName = b.Room.Name,
                    UserEmail = b.User.Email,
                    Start = b.Start,
                    End = b.End,
                    Status = b.Status.ToString()
                })
                .ToListAsync();
        }


        public async Task<PaginatedResult<BookingListResponseDto>> GetSortedBookingsAsync(
            string? sortBy,
            bool descending,
            int page,
            int pageSize)
        {
            var query = _context.Bookings
                .Include(b => b.Room)
                .Include(b => b.User)
                .AsQueryable();

            query = sortBy switch
            {
                "RoomName" => descending
                    ? query.OrderByDescending(b => b.Room.Name)
                    : query.OrderBy(b => b.Room.Name),

                "CreatedAt" => descending
                    ? query.OrderByDescending(b => b.CreatedAt)
                    : query.OrderBy(b => b.CreatedAt),

                _ => descending
                    ? query.OrderByDescending(b => b.Start)
                    : query.OrderBy(b => b.Start),
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookingListResponseDto
                {
                    Id = b.Id,
                    RoomName = b.Room.Name,
                    UserEmail = b.User.Email,
                    Start = b.Start,
                    End = b.End,
                    Status = b.Status.ToString()
                })
                .ToListAsync();

            return new PaginatedResult<BookingListResponseDto>(items, totalCount, page, pageSize);
        }





    }
}