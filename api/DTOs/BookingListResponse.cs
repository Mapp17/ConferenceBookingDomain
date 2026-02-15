using System.Collections.Generic;


namespace api.DTOs
{
    public class BookingListResponseDto
    {
        public int Id { get; set; }            // Booking ID
        public string RoomName { get; set; }   // Room name
        public string UserEmail { get; set; }  // User who booked
        public DateTime Start { get; set; }    // Booking start
        public DateTime End { get; set; }      // Booking end
        public string Status { get; set; }     // Booking status (string for simplicity)
    }
}
