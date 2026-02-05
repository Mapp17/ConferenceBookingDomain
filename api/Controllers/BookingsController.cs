using Bookinglib.Services;
using Bookinglib.Domain;
using Bookinglib.Logic;
using Microsoft.AspNetCore.Mvc;
using ConferenceBookingDomain.api.DTOs;

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
        [HttpPost]
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

            try
            {
                // Convert RoomType string -> enum
                var roomType = Enum.Parse<RoomType>(dto.RoomType, ignoreCase: true);

                // Create domain room
                var room = new ConferenceRoom(
                    dto.RoomId,
                    dto.RoomName,
                    dto.Capacity,
                    roomType.ToString()
                );

                // Create booking request
                var request = new BookingRequest(
                    room,
                    dto.Start,
                    dto.End
                );

                // Call service
                var bookings = await _service.CreateBookingAsync(request);
                var booking = bookings.First();

                // Map domain -> response DTO
                var response = new BookingResponseDto
                {
                    RoomName = booking.Room.Name,
                    RoomType = booking.Room.Type.ToString(),
                    Start = booking.Start,
                    End = booking.End
                };

                return Ok(response);
            }
            catch (BookingConflictException ex)
            {
                return BadRequest(new ErrorResponseDto
                {
                    Message = ex.Message,
                    Code = "DOMAIN_RULE_VIOLATION"
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new ErrorResponseDto
                {
                    Message = "An unexpected error occurred.",
                    Code = "INTERNAL_SERVER_ERROR"
                });
            }
        }

        // -------------------------------
        // GET: api/bookings
        // -------------------------------
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
                        RoomType = b.Room.Type.ToString(),
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
    }
}
