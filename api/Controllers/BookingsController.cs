using Bookinglib.Services;
using Bookinglib.Domain;
using Bookinglib.Logic;
using Microsoft.AspNetCore.Mvc;
using ConferenceBookingDomain.api.DTOs;
using Microsoft.AspNetCore.Authorization;

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

            //  Fetch room from database
            var room = await _roomRepo.GetRoomByIdAsync(dto.RoomId);
            if (room == null)
            {
                return NotFound(new ErrorResponseDto
                {
                    Message = "Room not found.",
                    Code = "ROOM_NOT_FOUND"
                });
            }

            //  Check if room is available
            var overlappingBookings = await _bookingRepo.GetAllBookingsAsync();
            bool isOverlapping = overlappingBookings.Any(b =>
                b.RoomId == room.Id &&
                b.Start < dto.End &&
                b.End > dto.Start
            );

            if (isOverlapping)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Room is already booked for the selected time.",
                    Code = "ROOM_UNAVAILABLE"
                });
            }

            // Create booking
            var booking = new Booking(room, dto.Start, dto.End);
            await _bookingRepo.AddBookingAsync(booking);
            await _bookingRepo.SaveChangesAsync();

            //  Map to response DTO
            var response = new BookingResponseDto
            {
                RoomName = room.Name,
                RoomType = room.Type,
                Start = booking.Start,
                End = booking.End,
                Capacity = room.Capacity
            };

            return Ok(response);
        }
    
        // Delete Booking
        [Authorize(Roles="Admin, Employees")]
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
        [Authorize(Roles= "Admin, Employees")]
        [HttpGet("allbookings")]
        public async Task<ActionResult<List<Booking>>> GetAllBookings()
        {
            var bookings = await _bookingRepo.GetAllBookingsAsync();
            return Ok(bookings);
        }

        
        [Authorize(Roles = "Receptionist")]
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


        [Authorize(Roles = "FacilitiesManager")]
        [HttpGet("maintenance")]
        public IActionResult GetRoomsForMaintenance()
        {
            return Ok();
        }


        
    }
}