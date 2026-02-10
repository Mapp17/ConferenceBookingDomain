using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Bookinglib.Domain;
public class RoomController : ControllerBase
{
    private readonly IRoomRepository _roomRepository;

    public RoomController(IRoomRepository roomRepository)
    {
        _roomRepository = roomRepository;
    }

    [Authorize(Roles = "Admin,Employees")]
    [HttpGet("/api/rooms")]
    public async Task<ActionResult<List<ConferenceRoom>>> GetAllRooms()
    {
        var rooms = await _roomRepository.GetAllRoomsAsync();
        return Ok(rooms);
    }

    [Authorize(Roles = "Employees")]
    [HttpGet("/api/rooms/available")]
    public async Task<ActionResult<List<ConferenceRoom>>> GetAvailableRooms([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        var rooms = await _roomRepository.GetAvailableRoomsAsync(start, end);
        return Ok(rooms);
    }


}