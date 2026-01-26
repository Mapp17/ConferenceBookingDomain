using System;

namespace ConferenceBookingDomain
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Conference Room Booking System Domain Model ===\n");
            
            var mainConferenceRoom = new ConferenceRoom(
                "Training Center Hall", 
                new RoomCapacity(50));
            
            
            var smallMeetingRoom = new ConferenceRoom(
                "General Meeting Room",
                new RoomCapacity(8));
            
            
            Console.WriteLine($"Created rooms: {mainConferenceRoom.Name} (Capacity: {mainConferenceRoom.Capacity})");
            Console.WriteLine($"Created rooms: {smallMeetingRoom.Name} (Capacity: {smallMeetingRoom.Capacity})\n");
            
            // 2. Create bookings
            var bookingTime = new TimeSlot(
                DateTime.UtcNow.AddHours(2),
                DateTime.UtcNow.AddHours(3));
            
            try
            {
                var booking1 = Booking.Create(
                    mainConferenceRoom,
                    bookingTime,
                    "trainee1@bitcube.tech");

                
                Console.WriteLine($"Room: {booking1.Room.Name}");
                Console.WriteLine($"Time: {booking1.TimeSlot.StartTime:HH:mm} to {booking1.TimeSlot.EndTime:HH:mm}");
                Console.WriteLine($"Status: {booking1.Room.Status}");

                
                var conflictingTime = new TimeSlot(
                    DateTime.UtcNow.AddHours(2).AddMinutes(30),
                    DateTime.UtcNow.AddHours(4));
                
                bool isAvailable = mainConferenceRoom.IsAvailableFor(conflictingTime);
                Console.WriteLine($"Room available for conflicting time? {isAvailable}");
                

                try
                {
                    var invalidBooking = Booking.Create(
                        mainConferenceRoom,
                        conflictingTime,
                        "trainee2@bitcube.tech");
                    Console.WriteLine("ERROR: Should not allow double booking!");
                }
                catch (InvalidOperationException ex)
                {
                    Console.WriteLine($"Correctly prevented double booking: {ex.Message}\n");
                }
                
                booking1.CancelBooking();
                Console.WriteLine($"Booking cancelled. New status: {booking1.Room.Status}\n");
                

                try
                {
                    var invalidCapacity = new RoomCapacity(-5);
                }
                catch (ArgumentException ex)
                {
                    Console.WriteLine($"Correctly validated capacity: {ex.Message}\n");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            

        }
    }
}