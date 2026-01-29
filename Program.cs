using System;
using System.Collections.Generic;
using System.Linq;
using ConferenceRoomBookingSystem;
static async Task Main()
{
    SeedData data = new SeedData();
    List<ConferenceRoom> rooms = data.SeedRooms();
    BookingManager manager = new BookingManager();
    BookingFileStore store = new BookingFileStore("Booking.json");

    try
    {
        manager.CreateBooking(new BookingRequest(rooms[0],DateTime.Now,DateTime.Now.AddHours(1)));
        await store.SaveAsync(manager.GetBookings());
    }
    catch(BookingConflictException bx)
    {
        Console.WriteLine(bx.Message);
    }
}