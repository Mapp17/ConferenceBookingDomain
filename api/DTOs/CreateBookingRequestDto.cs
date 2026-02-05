

 public class CreateBookingRequestDto
    {
        public int RoomId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public RoomType RoomType { get; set; }
        public int Capacity { get; set; }
        public string RoomName { get; set; }
    }