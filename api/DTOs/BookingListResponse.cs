using System.Collections.Generic;
using ConferenceBookingDomain.api.DTOs;

namespace ConferenceBookingDomain.api.DTOs
{
    public class BookingListResponseDto
    {
         public IReadOnlyList<BookingResponseDto> Bookings { get; set; }
        public int TotalCount { get; set; }
    }
}