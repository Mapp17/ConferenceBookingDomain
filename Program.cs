using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConferenceRoomBookingSystem
{
    class Program
    {
        private static BookingLogic _bookingLogic = new BookingLogic(new List<ConferenceRoom>());
        private static bool _isRunning = true;

        static async Task Main()
        {
            InitializeSystem();
            ShowWelcomeMessage();

            while (_isRunning)
            {
                ShowMainMenu();
                HandleMenuSelection();
                try
            {
                await _bookingLogic.SaveBookingsAsync("bookings.json");
                Console.WriteLine("Bookings saved successfully.");
            }
            catch(ConferenceBookingHandleException ex)
            {
                Console.WriteLine($"Error saving bookings: {ex.Message}");
            }
            }
            
            ShowExitMessage();
        }

        private static void InitializeSystem()
        {
            Console.WriteLine("Initializing Conference Room Booking System...\n");

            var rooms = new List<ConferenceRoom>
            {
                new ConferenceRoom(1, "Training Center Hall", new RoomCapacity(50)),
                new ConferenceRoom(2, "General Meeting Room", new RoomCapacity(8)),
                new ConferenceRoom(3, "Discussion Room", new RoomCapacity(17)),
                new ConferenceRoom(4, "Executive Boardroom", new RoomCapacity(26)),
                new ConferenceRoom(5, "Training Center Hall 2", new RoomCapacity(10)),
                new ConferenceRoom(6, "Conference Room", new RoomCapacity(35))
            };

            _bookingLogic = new BookingLogic(rooms);
            Console.WriteLine($"✓ System initialized with {rooms.Count} conference rooms\n");
        }

        private static void ShowWelcomeMessage()
        {
            Console.WriteLine("╔══════════════════════════════════════════════════════╗");
            Console.WriteLine("║    CONFERENCE ROOM BOOKING SYSTEM                   ║");
            Console.WriteLine("║    Interactive Console Application                  ║");
            Console.WriteLine("╚══════════════════════════════════════════════════════╝\n");
        }

        private static void ShowMainMenu()
        {
            Console.WriteLine("\n═══════════════════════════════════════════════════");
            Console.WriteLine("                    MAIN MENU                      ");
            Console.WriteLine("═══════════════════════════════════════════════════");
            Console.WriteLine("1.  View All Rooms");
            Console.WriteLine("2.  Check Room Availability");
            Console.WriteLine("3.  Make a Booking");
            Console.WriteLine("4.  View/Cancel Bookings");
            Console.WriteLine("5.  Manage Rooms");
            Console.WriteLine("8.  Clear Screen");
            Console.WriteLine("0.  Exit");
            Console.WriteLine("═══════════════════════════════════════════════════");
            Console.Write("Select an option (0-8): ");
        }

        private static void HandleMenuSelection()
        {
            if (!int.TryParse(Console.ReadLine(), out var choice))
            {
                Console.WriteLine("\n Invalid input. Please enter a number.");
                return;
            }

            switch (choice)
            {
                case 0:
                    _isRunning = false;
                    break;
                case 1:
                    ViewAllRooms();
                    break;
                case 2:
                    CheckRoomAvailability();
                    break;
                case 3:
                    MakeBooking();
                    break;
                case 4:
                    ManageBookings();
                    break;
                case 5:
                    ManageRooms();
                    break;
                case 8:
                    Console.Clear();
                    ShowWelcomeMessage();
                    break;
                default:
                    Console.WriteLine("\n Invalid option. Please select 0-8.");
                    break;
            }
        }

        private static void ViewAllRooms()
        {
            Console.WriteLine("\n═══════════════════════════════════════════════════");
            Console.WriteLine("                  ALL CONFERENCE ROOMS            ");
            Console.WriteLine("═══════════════════════════════════════════════════");

          
            var rooms = _bookingLogic.GetAllRooms();  
            foreach (var room in rooms)
            {
                Console.WriteLine($"\nRoom #{room.RoomId}: {room.Name}");
                Console.WriteLine($"  Capacity: {room.Capacity.Value} people");
                Console.WriteLine($"  Status: {room.roomStatus}");
                
                var upcomingBookings = room.Bookings
                    .Where(b => b.Status == BookingStatus.Confirmed && b.TimeSlot.StartTime > DateTime.UtcNow)
                    .OrderBy(b => b.TimeSlot.StartTime)
                    .Take(3);
                
                if (upcomingBookings.Any())
                {
                    Console.WriteLine($"  Next bookings:");
                    foreach (var booking in upcomingBookings)
                    {
                        Console.WriteLine($"    • {booking.TimeSlot.StartTime:MMM dd HH:mm} - {booking.BookerName}");
                    }
                }
                else
                {
                    Console.WriteLine($"  No upcoming bookings");
                }
            }
            
            Console.WriteLine($"\nTotal: {rooms.Count} rooms");
            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        private static void CheckRoomAvailability()
        {
            Console.WriteLine("\n═══════════════════════════════════════════════════");
            Console.WriteLine("               CHECK ROOM AVAILABILITY            ");
            Console.WriteLine("═══════════════════════════════════════════════════");

            var timeSlot = GetTimeSlotFromUser();
            if (timeSlot == null) return;

            Console.Write("Minimum capacity required (press Enter for any): ");
            int? minCapacity = null;
            if (int.TryParse(Console.ReadLine(), out var capacity))
            {
                minCapacity = capacity;
            }

            Console.WriteLine($"\nAvailable rooms for {timeSlot.StartTime:MMM dd, HH:mm} - {timeSlot.EndTime:HH:mm}:");
            
            List<ConferenceRoom> availableRooms;
            if (minCapacity.HasValue)
            {
                availableRooms = _bookingLogic.GetAvailableRooms(timeSlot, minCapacity.Value);
            }
            else
            {
                availableRooms = _bookingLogic.GetAvailableRooms(timeSlot);
            }

            if (!availableRooms.Any())
            {
                Console.WriteLine("\n No rooms available for the specified criteria.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine("\n┌────┬─────────────────────────────┬─────────┬────────────────────────┐");
            Console.WriteLine("│ ID │ Room Name                   │ Capacity│ Equipment              │");
            Console.WriteLine("├────┼─────────────────────────────┼─────────┼────────────────────────┤");

            foreach (var room in availableRooms.OrderBy(r => r.RoomId))
            {
                                
                Console.WriteLine($"│ {room.RoomId,2} │ {room.Name,-27} │ {room.Capacity.Value,7} │");
            }

            Console.WriteLine("└────┴─────────────────────────────┴─────────┴────────────────────────┘");
            Console.WriteLine($"\nFound {availableRooms.Count} available room(s)");
            
            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        private static void MakeBooking()
        {
            Console.WriteLine("\n═══════════════════════════════════════════════════");
            Console.WriteLine("                   MAKE A BOOKING                 ");
            Console.WriteLine("═══════════════════════════════════════════════════");

            // Step 1: Get time slot
            Console.WriteLine("\nStep 1: Select Time Slot");
            var timeSlot = GetTimeSlotFromUser();
            if (timeSlot == null) return;

            // Step 2: Show available rooms
            var availableRooms = _bookingLogic.GetAvailableRooms(timeSlot);
            if (!availableRooms.Any())
            {
                Console.WriteLine("\n No rooms available for the selected time slot.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine($"\nAvailable rooms for {timeSlot.StartTime:MMM dd, HH:mm} - {timeSlot.EndTime:HH:mm}:");
            foreach (var room in availableRooms)
            {
                Console.WriteLine($"  {room.RoomId}. {room.Name} (Capacity: {room.Capacity.Value})");
            }

            // Step 3: Select room
            Console.Write("\nStep 2: Enter Room ID: ");
            if (!int.TryParse(Console.ReadLine(), out var roomId) || !availableRooms.Any(r => r.RoomId == roomId))
            {
                Console.WriteLine("\n Invalid Room ID.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            // Step 4: Get booker name
            Console.Write("\nStep 3: Enter your name: ");
            var bookerName = Console.ReadLine()?.Trim();
            if (string.IsNullOrWhiteSpace(bookerName))
            {
                Console.WriteLine("\n Name cannot be empty.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            // Step 5: Validate booking request
            if (!_bookingLogic.IsBookingRequestValid(roomId, timeSlot, out var errorMessage))
            {
                Console.WriteLine($"\n Booking failed: {errorMessage}");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            // Step 6: Make the booking
            var result = _bookingLogic.RequestBooking(roomId, timeSlot, bookerName);
            
            if (result.IsSuccess)
            {
                Console.WriteLine($"\n Booking created successfully!");
                Console.WriteLine($"   Booking ID: {result.Booking?.BookingId}");
                Console.WriteLine($"   Room: {Booking.Room.Name}");
                Console.WriteLine($"   Time: {result.Booking?.TimeSlot.StartTime:MMM dd, HH:mm} - {result.Booking?.TimeSlot.EndTime:HH:mm}");
                Console.WriteLine($"   Status: {result.Booking?.Status}");
                
                // Ask to confirm booking
                Console.Write("\nDo you want to confirm this booking now? (Y/N): ");
                var confirm = Console.ReadLine()?.ToUpper();
                
                if (confirm == "Y")
                {
                    if (_bookingLogic.ConfirmBooking(result.Booking.BookingId))
                    {
                        Console.WriteLine(" Booking confirmed!");
                    }
                    else
                    {
                        Console.WriteLine("  Booking could not be confirmed. It remains in Pending status.");
                    }
                }
            }
            else
            {
                Console.WriteLine($"\n Booking failed: {result.ErrorMessage}");
            }

            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        private static void ManageBookings()
        {
            Console.WriteLine("\n═══════════════════════════════════════════════════");
            Console.WriteLine("                VIEW/CANCEL BOOKINGS              ");
            Console.WriteLine("═══════════════════════════════════════════════════");

            Console.WriteLine("\n1. View all bookings");
            Console.WriteLine("2. View my bookings");
            Console.WriteLine("3. Cancel a booking");
            Console.WriteLine("4. Back to main menu");
            Console.Write("\nSelect option (1-4): ");

            if (!int.TryParse(Console.ReadLine(), out var choice))
            {
                Console.WriteLine("\n Invalid input.");
                return;
            }

            switch (choice)
            {
                case 1:
                    ViewAllBookings();
                    break;
                case 2:
                    CancelBooking();
                    break;
                    return;
                default:
                    Console.WriteLine("\n Invalid option.");
                    break;
            }
        }

        private static void ViewAllBookings()
        {
            var bookings = _bookingLogic.GetAllBookings();
            
            if (!bookings.Any())
            {
                Console.WriteLine("\nNo bookings found.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine("\n┌─────┬─────────────┬──────────────────────┬────────────────────────┬──────────┐");
            Console.WriteLine("│ ID  │ Room        │ Time Slot            │ Booker                │ Status   │");
            Console.WriteLine("├─────┼─────────────┼──────────────────────┼────────────────────────┼──────────┤");

            foreach (var booking in bookings.OrderBy(b => b.TimeSlot.StartTime))
            {
                var timeDisplay = $"{booking.TimeSlot.StartTime:MM/dd HH:mm}-{booking.TimeSlot.EndTime:HH:mm}";
                
                
                Console.WriteLine($"│ {booking.BookingId,4} │ {booking.BookerName,-11} │ {timeDisplay,-20} │ {booking.BookerName,-22} │ {booking.Status,-7} │");
            }

            Console.WriteLine("└─────┴─────────────┴──────────────────────┴────────────────────────┴──────────┘");
            
            var stats = bookings.GroupBy(b => b.Status)
                .Select(g => $"{g.Key}: {g.Count()}")
                .ToList();
            
            Console.WriteLine($"\n Booking Statistics: {string.Join(", ", stats)}");
            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }


        private static void CancelBooking()
        {
            Console.Write("\nEnter Booking ID to cancel: ");
            
            if (!int.TryParse(Console.ReadLine(), out var bookingId))
            {
                Console.WriteLine("\n Invalid Booking ID.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            var booking = _bookingLogic.GetBookingById(bookingId);
            if (booking == null)
            {
                Console.WriteLine($"\n Booking #{bookingId} not found.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine($"\nBooking Details:");
            Console.WriteLine($"  Time: {booking.TimeSlot.StartTime:MMM dd, HH:mm} - {booking.TimeSlot.EndTime:HH:mm}");
            Console.WriteLine($"  Booker: {booking.BookerName}");
            Console.WriteLine($"  Status: {booking.Status}");

            Console.Write("\nAre you sure you want to cancel this booking? (Y/N): ");
            var confirm = Console.ReadLine()?.ToUpper();

            if (confirm == "Y")
            {
                if (_bookingLogic.CancelBooking(bookingId))
                {
                    Console.WriteLine("\n Booking cancelled successfully.");
                }
                else
                {
                    Console.WriteLine("\n Unable to cancel booking. It may already be completed or cancelled.");
                }
            }
            else
            {
                Console.WriteLine("\nBooking cancellation aborted.");
            }

            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        private static void ManageRooms()
        {
            Console.WriteLine("\n═══════════════════════════════════════════════════");
            Console.WriteLine("                   MANAGE ROOMS                   ");
            Console.WriteLine("═══════════════════════════════════════════════════");

            Console.WriteLine("\n1. View room details");
            Console.WriteLine("2. Change room status");
            Console.WriteLine("3. View room schedule");
            Console.WriteLine("4. Back to main menu");
            Console.Write("\nSelect option (1-4): ");

            if (!int.TryParse(Console.ReadLine(), out var choice))
            {
                Console.WriteLine("\n Invalid input.");
                return;
            }

            switch (choice)
            {
                case 1:
                    ViewRoomDetails();
                    break;
                case 2:
                    ChangeRoomStatus();
                    break;
                case 3:
                    ViewRoomSchedule();
                    break;
                case 4:
                    return;
                default:
                    Console.WriteLine("\n Invalid option.");
                    break;
            }
        }

        private static void ViewRoomDetails()
        {
            Console.Write("\nEnter Room ID: ");
            
            if (!int.TryParse(Console.ReadLine(), out var roomId))
            {
                Console.WriteLine("\n Invalid Room ID.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            var room = _bookingLogic.GetRoomById(roomId);
            if (room == null)
            {
                Console.WriteLine($"\n Room #{roomId} not found.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine($"\n Room Details - {room.Name}");
            Console.WriteLine($"   ID: {room.RoomId}");
            Console.WriteLine($"   Capacity: {room.Capacity.Value} people");
            Console.WriteLine($"   Status: {room.roomStatus}");
            
            var todayBookings = room.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed && b.TimeSlot.StartTime.Date == DateTime.UtcNow.Date)
                .OrderBy(b => b.TimeSlot.StartTime);
            
            if (todayBookings.Any())
            {
                Console.WriteLine($"\n    Today's Schedule:");
                foreach (var booking in todayBookings)
                {
                    var status = booking.TimeSlot.StartTime > DateTime.UtcNow ? "Upcoming" : "In Progress";
                    Console.WriteLine($"     • {booking.TimeSlot.StartTime:HH:mm}-{booking.TimeSlot.EndTime:HH:mm} - {booking.BookerName} ({status})");
                }
            }
            
            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        private static void ChangeRoomStatus()
        {
            Console.Write("\nEnter Room ID: ");
            
            if (!int.TryParse(Console.ReadLine(), out var roomId))
            {
                Console.WriteLine("\n Invalid Room ID.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            var room = _bookingLogic.GetRoomById(roomId);
            if (room == null)
            {
                Console.WriteLine($"\n Room #{roomId} not found.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine($"\nCurrent status of '{room.Name}': {room.roomStatus}");
            
            Console.WriteLine("\nAvailable statuses:");
            var statuses = Enum.GetValues<RoomStatus>();
            for (int i = 0; i < statuses.Length; i++)
            {
                Console.WriteLine($"  {i + 1}. {statuses[i]}");
            }

            Console.Write("\nSelect new status (1-3): ");
            
            if (!int.TryParse(Console.ReadLine(), out var statusChoice) || statusChoice < 1 || statusChoice > statuses.Length)
            {
                Console.WriteLine("\n Invalid selection.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            var newStatus = statuses[statusChoice - 1];
            
            try
            {
                room.UpdateStatus(newStatus);
                Console.WriteLine($"\n Room status updated to: {newStatus}");
            }
            catch (ConferenceBookingHandleException ex)
            {
                Console.WriteLine($"\n Cannot change status: {ex.Message}");
            }

            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        private static void ViewRoomSchedule()
        {
            Console.Write("\nEnter Room ID: ");
            
            if (!int.TryParse(Console.ReadLine(), out var roomId))
            {
                Console.WriteLine("\n Invalid Room ID.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            var room = _bookingLogic.GetRoomById(roomId);
            if (room == null)
            {
                Console.WriteLine($"\n Room #{roomId} not found.");
                Console.Write("\nPress any key to continue...");
                Console.ReadKey();
                return;
            }

            Console.WriteLine($"\n Schedule for {room.Name}");
            Console.WriteLine("═══════════════════════════════════════════════════");

            var upcomingBookings = room.Bookings
                .Where(b => b.Status == BookingStatus.Confirmed && b.TimeSlot.StartTime > DateTime.UtcNow)
                .OrderBy(b => b.TimeSlot.StartTime)
                .ToList();

            if (!upcomingBookings.Any())
            {
                Console.WriteLine("\nNo upcoming bookings scheduled.");
            }
            else
            {
                Console.WriteLine("\nUpcoming bookings:");
                foreach (var booking in upcomingBookings)
                {
                    var daysUntil = (booking.TimeSlot.StartTime - DateTime.UtcNow).Days;
                    var dayText = daysUntil == 0 ? "Today" : 
                                 daysUntil == 1 ? "Tomorrow" : 
                                 $"{daysUntil} days";
                    
                    Console.WriteLine($"\n   {booking.TimeSlot.StartTime:ddd, MMM dd, yyyy}");
                    Console.WriteLine($"     Time: {booking.TimeSlot.StartTime:HH:mm} - {booking.TimeSlot.EndTime:HH:mm}");
                    Console.WriteLine($"     Booker: {booking.BookerName}");
                    Console.WriteLine($"     ({dayText})");
                }
            }

            var pastBookings = room.Bookings
                .Where(b => b.Status == BookingStatus.Completed || b.Status == BookingStatus.Cancelled)
                .OrderByDescending(b => b.TimeSlot.StartTime)
                .Take(5)
                .ToList();

            if (pastBookings.Any())
            {
                Console.WriteLine("\nRecent past bookings:");
                foreach (var booking in pastBookings)
                {
                    var statusIcon = booking.Status == BookingStatus.Completed ? "✅" : "❌";
                    Console.WriteLine($"  {statusIcon} {booking.TimeSlot.StartTime:MMM dd}: {booking.BookerName} ({booking.Status})");
                }
            }

            Console.Write("\nPress any key to continue...");
            Console.ReadKey();
        }

        private static TimeSlot GetTimeSlotFromUser()
        {
            Console.WriteLine("\nEnter booking details:");
            
            DateTime startTime;
            while (true)
            {
                Console.Write("Start date/time (YYYY-MM-DD HH:mm, or press Enter for today at 9 AM): ");
                var startInput = Console.ReadLine();
                
                if (string.IsNullOrWhiteSpace(startInput))
                {
                    var today = DateTime.UtcNow.Date.AddHours(9);
                    if (today < DateTime.UtcNow) today = today.AddDays(1);
                    startTime = today;
                    break;
                }
                
                if (DateTime.TryParse(startInput, out var parsedStart))
                {
                    if (parsedStart < DateTime.UtcNow)
                    {
                        Console.WriteLine("Start time cannot be in the past. Please try again.");
                        continue;
                    }
                    startTime = parsedStart;
                    break;
                }
                
                Console.WriteLine("Invalid date format. Please use YYYY-MM-DD HH:mm");
            }

            int durationHours;
            while (true)
            {
                Console.Write("Duration in hours (1-8, default 1): ");
                var durationInput = Console.ReadLine();
                
                if (string.IsNullOrWhiteSpace(durationInput))
                {
                    durationHours = 1;
                    break;
                }
                
                if (int.TryParse(durationInput, out durationHours) && durationHours >= 1 && durationHours <= 8)
                {
                    break;
                }
                
                Console.WriteLine("Invalid duration. Please enter a number between 1 and 8.");
            }

            try
            {
                var endTime = startTime.AddHours(durationHours);
                return new TimeSlot(startTime, endTime);
            }
            catch (ConferenceBookingHandleException ex)
            {
                Console.WriteLine($"Error creating time slot: {ex.Message}");
                return null;
            }
        }

        private static void ShowExitMessage()
        {
            Console.WriteLine("\n═══════════════════════════════════════════════════");
            Console.WriteLine("    Thank you for using the Booking System!       ");
            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }
    }
}