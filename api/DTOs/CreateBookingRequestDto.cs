
namespace api.DTOs
{
     public class CreateBookingRequestDto
    {
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}