
using System.Text.Json;
using Bookinglib;
using Bookinglib.Domain;

namespace Bookinglib.Persistence
{
    public interface IBookingFileStore
    {
        Task SaveAsync(IEnumerable<Booking> bookings);
        Task<List<Booking>> LoadAsync();
        Task<Booking> GetBookingIdAsync(int id);
    }

    public class BookingFileStore : IBookingFileStore
    {
        private readonly string _filepath = "bookings.json";
        public BookingFileStore(string filePath)
        {
            _filepath = filePath;
        }

        public async Task SaveAsync(IEnumerable<Booking> bookings)
        {            
            string json = JsonSerializer.Serialize(bookings);
            await File.WriteAllTextAsync(_filepath, json);
        }

        public async Task<List<Booking>> LoadAsync()
        {
            
            if (!File.Exists(_filepath))
                return new List<Booking>();
            
            string json = await File.ReadAllTextAsync(_filepath);
            var bookings = JsonSerializer.Deserialize<List<Booking>>(json);
            return bookings ?? new List<Booking>();
        }

        public async Task<Booking> GetBookingIdAsync(int id)
        {
            var bookings = await LoadAsync();
            return bookings.FirstOrDefault(b => b.Room.Id == id);
        }


    }
}