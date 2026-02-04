using ConferenceRoomBookingSystem;
using Bookinglib;

namespace Bookinglib
{
    public record BookingRequest
    {
        public ConferenceRoom Room {get;}
        public DateTime Start {get;}
        public  DateTime End {get;}
        public BookingRequest(ConferenceRoom room, DateTime start, DateTime end)
        {
            Room = room;
            Start = start;
            End = end;
        }
    }
}