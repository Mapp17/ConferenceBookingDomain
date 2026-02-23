using Bookinglib.Data;
using Bookinglib.Persistence;
using Bookinglib.Domain;

public static class RoomSeeder
{
    public static async Task SeedAsync(BookingAppDbContext context)
    {
        if (!context.ConferenceRooms.Any())
        {
            context.ConferenceRooms.AddRange( 
            new ConferenceRoom (1, "Room A", 10,  "Standard"),
            new ConferenceRoom (2, "Room B", 20,  "Boardroom"),
            new ConferenceRoom (3, "Room C", 15,  "Training"),
            new ConferenceRoom (4, "Room D", 25,  "Standard"),
            new ConferenceRoom (5, "Room E", 30,  "Boardroom"),
            new ConferenceRoom (6, "Room F", 10,  "Training"),
            new ConferenceRoom (7, "Room G", 20,  "Standard"),
            new ConferenceRoom (8, "Room H", 15,  "Boardroom"),
            new ConferenceRoom (9, "Room I", 13,  "Training"),
            new ConferenceRoom (10, "Room J", 20,  "Standard"),
            new ConferenceRoom (11, "Room K", 10,  "Boardroom"),
            new ConferenceRoom (12, "Room L", 5,  "Training"),
            new ConferenceRoom (13, "Room M", 12,  "Standard"),
            new ConferenceRoom (14, "Room N", 15,  "Boardroom"),
            new ConferenceRoom (15, "Room O", 12,  "Training"),
            new ConferenceRoom (16, "Room P", 30,  "Standard")
            );
            await context.SaveChangesAsync();
        }

        if (!context.Users.Any())
        {
            var users = new List<User>
            {
                new User
                {
                    Name = "System Admin",
                    Email = "admin@example.com",
                    Role = "Admin"
                },
                new User
                {
                    Name = "Test User",
                    Email = "employee@example.com",
                    Role = "Employee"
                }
            };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }


        if (!context.Bookings.Any())
        {
            var room = context.ConferenceRooms.First(); 
            var user = context.Users.First();

            context.Bookings.Add(new Booking
            {
                RoomId = room.Id, 
                UserId = user.Id,
                Status = BookingStatus.Confirmed,
                CreatedAt = DateTime.UtcNow,
                Start = DateTime.UtcNow.AddHours(1),
                End = DateTime.UtcNow.AddHours(2),
                CancelledAt = null
            });

            await context.SaveChangesAsync();
        }

        if (!context.Sessions.Any())
        {
            context.Sessions.Add(new Session
            {
                Capacity = 20,
                StartTime = DateTime.UtcNow.AddHours(9),
                EndTime = DateTime.UtcNow.AddHours(11)
            });
            await context.SaveChangesAsync();
        }


    }
}
