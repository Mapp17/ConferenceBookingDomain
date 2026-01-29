
using System.Text.Json;

namespace ConferenceRoomBookingSystem
{
    public class BookingFileStore
    {
        private readonly string _filepath;
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


    }
}