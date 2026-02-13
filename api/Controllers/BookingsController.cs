using Bookinglib.Services;
using Bookinglib.Domain;
using Bookinglib.Logic;
using Microsoft.AspNetCore.Mvc;
using ConferenceBookingDomain.api.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography.X509Certificates;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;


namespace Api.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IRoomRepository _roomRepo;

        public BookingsController(IBookingRepository bookingRepo, IRoomRepository roomRepo)
        {
            _bookingRepo = bookingRepo;
            _roomRepo = roomRepo;
        }


        // -------------------------------
        // POST: api/bookings
        // -------------------------------
        [Authorize(Roles = "Employee,Receptionist")]
        [HttpPost("create")]
        [ProducesResponseType(typeof(BookingResponseDto), 201)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 409)]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto dto)
        {

            if (dto.Start >= dto.End)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Start date must be before end date.",
                    Code = "INVALID_INPUT"
                });
            }

            var room = await _roomRepo.GetRoomByIdAsync(dto.RoomId);

            if (room == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Room not found.",
                    Code = "ROOM_NOT_FOUND"
                });
            }

            if (!room.IsActive)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Room is inactive and cannot be booked.",
                    Code = "ROOM_INACTIVE"
                });
            }

            var overlappingBookings = await _bookingRepo.GetAllBookingsAsync();
            bool isOverlapping = overlappingBookings.Any(b =>
                b.RoomId == room.Id &&
                b.Start < dto.End &&
                b.End > dto.Start
            );

            if (isOverlapping)
            {
                return Conflict(new ErrorResponseDto
                {
                    Message = "Room is already booked for the selected time.",
                    Code = "ROOM_UNAVAILABLE"
                });
            }

            var booking = new Booking
            {
                RoomId = room.Id,                 
                Start = dto.Start,
                End = dto.End,
                Status = BookingStatus.Pending,               
                CreatedAt = DateTime.UtcNow,
                CancelledAt = null
            };

            await _bookingRepo.AddBookingAsync(booking);
            await _bookingRepo.SaveChangesAsync();

            var response = new BookingResponseDto
            {
                RoomName = room.Name,
                RoomType = room.Type,
                Start = booking.Start,
                End = booking.End,
                Capacity = room.Capacity,
                Status = booking.Status
            };

            return CreatedAtAction(nameof(CreateBooking), new { id = booking.Id }, response);
        }

        // Delete Booking
        [Authorize(Roles = IdentitySeeder.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _bookingRepo.GetBookingByIdAsync(id);
            if (booking == null)
                return NotFound();

            await _bookingRepo.DeleteBookingAsync(booking);
            await _bookingRepo.SaveChangesAsync();

            return NoContent();
        }

        // -------------------------------
        // GET: api/bookings
        // -------------------------------
        [Authorize(Roles= IdentitySeeder.Admin + ", " + IdentitySeeder.Employee)]
        [HttpGet("allbookings")]
        public async Task<ActionResult<List<Booking>>> GetAllBookings()
        {
            var bookings = await _bookingRepo.GetAllBookingsAsync();
            return Ok(bookings);
        }

        
        [Authorize(Roles = IdentitySeeder.Receptionist)]
        [HttpGet("assist-booking")]
        public async Task<IActionResult> AssistBooking(
            [FromQuery] DateTime start,
            [FromQuery] DateTime end,
            [FromQuery] int requiredCapacity)
        {
            //  Fetch available rooms from repository
            var availableRooms = await _roomRepo.GetAvailableRoomsAsync(start, end);

            //  Filter by required capacity
            var suitableRooms = availableRooms
                .Where(r => r.Capacity >= requiredCapacity)
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Type,
                    r.Capacity
                })
                .ToList();

            return Ok(suitableRooms);
        }


        [Authorize(Roles = IdentitySeeder.FacilitiesManager)]
        [HttpGet("maintenance")]
        public IActionResult GetRoomsForMaintenance()
        {
            return Ok();
        }

        // Filtering/Sorting/Pagination endpoints would go here
        [HttpGet("Filtering")]
        public async Task<IActionResult> GetBookingsWithFiltering(
            [FromQuery] string? roomName,
            [FromQuery] string? location,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate,
            [FromQuery] string? status,
            [FromQuery] bool? isActive)
        {
            
            var bookings = _bookingRepo.GetAllBookingsAsQueryable();

            if (!string.IsNullOrEmpty(roomName))
                bookings = bookings.Where(b => b.Room.Name.ToLower().Contains(roomName.ToLower()));

            if (!string.IsNullOrEmpty(location))
                bookings = bookings.Where(b => b.Room.Location.ToLower().Contains(location.ToLower()));

            if (startDate.HasValue)
                bookings = bookings.Where(b => b.Start >= startDate.Value);

            if (endDate.HasValue)
                bookings = bookings.Where(b => b.End <= endDate.Value);

            if (startDate.HasValue && endDate.HasValue)
                bookings = bookings.Where(b => b.Start >= startDate.Value && b.End <= endDate.Value);

            if (!string.IsNullOrEmpty(status))
                bookings = bookings.Where(b => b.Status.ToString().ToLower() == status.ToLower());

            if (isActive.HasValue)
                bookings = bookings.Where(b => b.IsActive == isActive.Value);

            var results = await bookings.ToListAsync();

            return Ok(results);
        }

        // Sorting endpoint
        [HttpGet("sorted")]
        public async Task<IActionResult> GetBookingsSorted(
            [FromQuery] string? sortBy = null,
            [FromQuery] bool descending = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _bookingRepo.GetAllBookingsAsQueryable();

            query = sortBy switch
            {
                "RoomName" => descending ? query.OrderByDescending(b => b.Room.Name) : query.OrderBy(b => b.Room.Name),
                "CreatedAt" => descending ? query.OrderByDescending(b => b.CreatedAt) : query.OrderBy(b => b.CreatedAt),
                _ => descending ? query.OrderByDescending(b => b.Start) : query.OrderBy(b => b.Start),
            };

            int totalRecords = await query.CountAsync();

            var results = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalRecords = totalRecords,
                Page = page,
                PageSize = pageSize,
                Results = results
            });
        }

        // Pagination endpoint 
        [HttpGet("Paging")]
        public async Task<IActionResult> GetBookingsWithPaging(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _bookingRepo.GetAllBookingsAsQueryable();

            var totalBookings = await query.CountAsync();

            var bookings = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                Bookings = bookings,
                PageNumber = page,
                PageSize = pageSize,
                TotalBookings = totalBookings
            });
        }

        public async Task<PaginatedResult<BookingListResponse>> GetAll(
            int page, int pageSize)
        {
            var query = _bookingRepo.GetAllBookingsAsQueryable();

            var total = await query.CountAsync();

            var items = await query
                .OrderBy(b => b.StartTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => new BookingListResponse
                {
                    Id = b.Id,
                    RoomName = b.Room.Name,
                    UserEmail = b.User.Email,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime
                })
                .ToListAsync();

            return new PaginatedResult<BookingListResponse>(items, total);
        }

    }
}