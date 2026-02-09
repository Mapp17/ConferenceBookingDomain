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
        private readonly BookingService _service;

        public BookingsController(BookingService service)
        {
            _service = service;
        }

        // -------------------------------
        // POST: api/bookings
        // -------------------------------
        [Authorize(Roles = "Employee")]
        [HttpPost]
        [ProducesResponseType(typeof(BookingResponseDto), 201)]
        [ProducesResponseType(typeof(object), 400)]
        [ProducesResponseType(typeof(object), 404)]
        [ProducesResponseType(typeof(object), 409)]
        public async Task<IActionResult> CreateBooking(CreateBookingRequestDto dto)
        {
            if (dto.Start >= dto.End)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = "Start date must be before end date.",
                    Code = "INVALID_INPUT"
                });
            }

                var room = new ConferenceRoom(
                    dto.RoomId,
                    dto.RoomName,
                    dto.Capacity,
                    dto.RoomType
                );


                var request = new BookingRequest(
                    room,
                    dto.Start,
                    dto.End
                );

                var bookings = await _service.CreateBookingAsync(request);
                var booking = bookings.First();

                
                var response = new BookingResponseDto
                {
                    RoomId = booking.Room.Id,
                    RoomName = booking.Room.Name,
                    RoomType = booking.Room.Type,
                    Start = booking.Start,
                    End = booking.End,
                    Capacity = booking.Room.Capacity

                };

            return Ok(response);
        }
    
        

        // -------------------------------
        // GET: api/bookings
        // -------------------------------
        [Authorize(Roles= "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = await _service.GetAllBookingsAsync();

                var response = new BookingListResponseDto
                {
                    TotalCount = bookings.Count,
                    Bookings = bookings.Select(b => new BookingResponseDto
                    {
                        RoomName = b.Room.Name,
                        RoomType = b.Room.Type,
                        Start = b.Start,
                        End = b.End
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, new ErrorResponseDto
                {
                    Message = "Failed to retrieve bookings.",
                    Code = "INTERNAL_SERVER_ERROR"
                });
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BookingResponseDto), 200)]
        [ProducesResponseType(typeof(object), 404)]
        public async Task<IActionResult> GetBooking(int id)
        {
            var booking = await _service.GetBookingAsync(id);
            return Ok(booking);
        }

        
        [Authorize(Roles = "Receptionist")]
        [HttpGet("assist-booking")]
        public IActionResult AssistBooking(
            [FromQuery] DateTime start,
            [FromQuery] DateTime end,
            [FromQuery] int requiredCapacity)
        {
            var availableRooms = _service.GetAvailableRoomsAsync(
                start,
                end,
                requiredCapacity
            );

            return Ok(availableRooms);
        }

        [Authorize(Roles = "FacilitiesManager")]
        [HttpGet("maintenance")]
        public IActionResult GetRoomsForMaintenance()
        {
            return Ok();
        }


        
    }
}
