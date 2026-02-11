using Bookinglib.Domain;

namespace Bookinglib.Data
{
    public static class SeedData
    {

    
    public static List<ConferenceRoom> SeedRooms()
    {
        List<ConferenceRoom> seedRooms = new List<ConferenceRoom>
        
        {
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
            new ConferenceRoom (16, "Room P", 30,  "Standard"),
            
        };
    return seedRooms;
    }
}
}