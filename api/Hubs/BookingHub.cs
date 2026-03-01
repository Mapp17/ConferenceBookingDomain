using Microsoft.AspNetCore.SignalR;

namespace api.Hubs
{
    public class BookingHub : Hub
    {
        public async Task NotifyBookingCreated(object booking)
        {
            await Clients.All.SendAsync("BookingCreated", booking);
        }
    }
}