namespace Bookinglib.Domain
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        public int BookingId { get; set; }
        public Booking Booking { get; set; }

    }
}