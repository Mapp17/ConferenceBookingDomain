

 public class CreateBookingRequestDto
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string RoomType { get; set; }
        public int Capacity { get; set; }
        public string RoomName { get; set; }
    }