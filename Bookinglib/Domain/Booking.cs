using System;


namespace Bookinglib.Domain
{
    

public class Booking
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public int UserId { get; set; }
    public DateTime Start { get; set; }
    public DateTime End {get; set;}

    public BookingStatus Status { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CancelledAt { get; set; }

    public ConferenceRoom Room { get; set; }
    public User User { get; set; }

    public Booking() {}
    public Booking( ConferenceRoom room, DateTime start, DateTime end)
    {
        
        Room = room;
        Start = start;
        End = end;
        Status = BookingStatus.Pending;
        
    }

    public void Confirm()
    {
        Status = BookingStatus.Confirmed;
    }

        public void Cancel()
    {
        Status = BookingStatus.Cancelled;
        CancelledAt = DateTime.UtcNow;
    }

}
}