namespace ConferenceBookingDomain.api.DTOs
{

    public class BookingResponseDto
    {
        public int RoomId { get; set; }
        public string? RoomName { get; set; }
        public int Capacity { get; set; }
        public string RoomType { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

    }
}