using Bookinglib.Data;
using Bookinglib.Persistence;

public static class RoomSeeder
{
    public static async Task SeedAsync(BookingAppDbContext context)
    {
        if (!context.ConferenceRooms.Any())
        {
            context.ConferenceRooms.AddRange(SeedData.SeedRooms());
            await context.SaveChangesAsync();
        }
    }
}
