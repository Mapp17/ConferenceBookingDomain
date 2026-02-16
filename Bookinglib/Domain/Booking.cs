using System;

namespace Bookinglib.Domain
{
    public class Booking
    {
        public int Id { get; set; }
        public int RoomId { get; set; }
        public int UserId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public BookingStatus Status { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CancelledAt { get; set; }

        public ConferenceRoom Room { get; set; }
        public User User { get; set; }

        // Default constructor required by EF
        public Booking() {}

        // Constructor used in repository/service
        public Booking(int roomId, int userId, DateTime startTime, DateTime endTime)
        {
            RoomId = roomId;
            UserId = userId;
            Start = startTime;
            End = endTime;
            Status = BookingStatus.Pending;
        }

        // Optional convenience constructor
        public Booking(ConferenceRoom room, DateTime startTime, DateTime endTime)
        {
            Room = room;
            Start = startTime;
            End = endTime;
            Status = BookingStatus.Pending;
        }

        public void Confirm() => Status = BookingStatus.Confirmed;

        public void Cancel()
        {
            Status = BookingStatus.Cancelled;
            CancelledAt = DateTime.UtcNow;
        }
    }
}