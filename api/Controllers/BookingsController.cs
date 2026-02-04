// Try these combinations:
using Bookinglib;
using Bookinglib.Domain;
using Bookinglib.Logic;
using Bookinglib.Services;


// OR if those don't work, check what namespace is actually used:
// Open one of your model files from Bookinglib project and see the namespace
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace api.Controllers
{

    

    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingsController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet] // GET /api/bookings
        public async Task<IActionResult> GetAll()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpPost] // POST /api/bookings
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
            var booking = await _bookingService.CreateBookingAsync(request);
            return Ok(booking);
        }
    }
}