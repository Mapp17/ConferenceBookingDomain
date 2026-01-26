using System;

namespace ConferenceBookingDomain
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Conference Room Booking System Domain Model Demo ===\n");
            
            // 1. Create rooms
            var mainConferenceRoom = new ConferenceRoom(
                "Grand Conference Hall", 
                new RoomCapacity(50));
            
            /* mainConferenceRoom.AddEquipment(EquipmentType.Projector);
            mainConferenceRoom.AddEquipment(EquipmentType.VideoConferencing);
            mainConferenceRoom.AddEquipment(EquipmentType.SoundSystem); */
            
            var smallMeetingRoom = new ConferenceRoom(
                "Executive Meeting Room",
                new RoomCapacity(8));
            //smallMeetingRoom.AddEquipment(EquipmentType.Whiteboard);
            
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
                    "john.doe@company.com");
                
               // booking1.Confirm();
                //booking1.UpdateMeetingTitle("Quarterly Planning Meeting");
                
                //Console.WriteLine($"Created booking: {booking1.Id}");
                Console.WriteLine($"Room: {booking1.Room.Name}");
                Console.WriteLine($"Time: {booking1.TimeSlot.StartTime:HH:mm} to {booking1.TimeSlot.EndTime:HH:mm}");
                //Console.WriteLine($"Status: {booking1.}");
                //Console.WriteLine($"Meeting Title: {booking1.MeetingTitle}\n");
                
                // 3. Test availability
                var conflictingTime = new TimeSlot(
                    DateTime.UtcNow.AddHours(2).AddMinutes(30),
                    DateTime.UtcNow.AddHours(4));
                
                bool isAvailable = mainConferenceRoom.IsAvailableFor(conflictingTime);
                Console.WriteLine($"Room available for conflicting time? {isAvailable}");
                
                // 4. Test business rules
                try
                {
                    var invalidBooking = Booking.Create(
                        mainConferenceRoom,
                        conflictingTime,
                        "jane.smith@company.com");
                    Console.WriteLine("ERROR: Should not allow double booking!");
                }
                catch (InvalidOperationException ex)
                {
                    Console.WriteLine($"Correctly prevented double booking: {ex.Message}\n");
                }
                
                // 5. Demonstrate status transitions
                booking1.CancelBooking();
                Console.WriteLine($"Booking cancelled. New status: {booking1.Room.Status}\n");
                
                // 6. Test capacity validation
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
            
            Console.WriteLine("=== Demo Complete ===");
            

        }
    }
}