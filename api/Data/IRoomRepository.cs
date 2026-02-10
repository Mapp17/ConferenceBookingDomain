using Bookinglib.Domain;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IRoomRepository
{
    Task<List<ConferenceRoom>> GetAllRoomsAsync();
    Task<List<ConferenceRoom>> GetAvailableRoomsAsync(DateTime start, DateTime end);
    Task<ConferenceRoom?> GetRoomByIdAsync(int id);
}