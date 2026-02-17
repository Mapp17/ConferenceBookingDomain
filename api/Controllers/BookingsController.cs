
using Bookinglib.Domain;
using Bookinglib.Logic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography.X509Certificates;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using api.Services;
using api.DTOs;
using api.Common;



namespace Api.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        public BookingsController(IBookingService bookingService  )
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(int page = 1, int pageSize = 10)
        {
            var result = await _bookingService.GetAllBookingsAsync(page, pageSize);

            return Ok(result);
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
            try
            {
                var userId = dto.UserId; 
                var result = await _bookingService.CreateBookingAsync(dto, userId);

                return CreatedAtAction(nameof(CreateBooking), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // Delete Booking
        [Authorize(Roles = IdentitySeeder.Admin)]
        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var success = await _bookingService.CancelBookingAsync(id);

            if (!success)
                return NotFound();

            return NoContent();
        }

        // -------------------------------
        // GET: api/bookings
        // -------------------------------
        [Authorize(Roles= IdentitySeeder.Admin + ", " + IdentitySeeder.Employee)]
        [HttpGet("allbookings")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAll(int page = 1, int pageSize = 10)
        {
            var result = await _bookingService.GetAllBookingsAsync(page, pageSize);
            return Ok(result);
        }



        [Authorize(Roles = IdentitySeeder.FacilitiesManager)]
        [HttpGet("maintenance")]
        public IActionResult GetRoomsForMaintenance()
        {
            return Ok();
        }

        // Filtering/Sorting/Pagination endpoints would go here
        [HttpGet("filter")]
        public async Task<IActionResult> Filter(
            string? roomName,
            DateTime? startDate,
            DateTime? endDate,
            string? status)
        {
            var result = await _bookingService
                .GetFilteredBookingsAsync(roomName, startDate, endDate, status);

            return Ok(result);
        }


        // Sorting endpoint
        [HttpGet("sorted")]
        public async Task<IActionResult> Sorted(
            string? sortBy,
            bool descending = false,
            int page = 1,
            int pageSize = 10)
        {
            var result = await _bookingService
                .GetSortedBookingsAsync(sortBy, descending, page, pageSize);

            return Ok(result);
        }


        // Pagination endpoint 
        [HttpGet("Paging")]
        public async Task<IActionResult> Paging(int page = 1, int pageSize = 10)
        {
            var result = await _bookingService.GetAllBookingsAsync(page, pageSize);
            return Ok(result);
        }


    }
}