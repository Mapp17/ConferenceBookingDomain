namespace ConferenceRoomBookingSystem
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