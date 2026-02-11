

namespace Bookinglib.Domain
{
    public class ConferenceRoom
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Type { get; set; }

        public int Capacity { get; set; }

        public string Location { get; set; } = "";

        public bool IsActive { get; set; } = true;

        public ConferenceRoom() { }

        public ConferenceRoom(int id, string name, int capacity, string type)
        {
            Id = id;
            Name = name;
            Capacity = capacity;
            Type = type;
            IsActive = true;
        }
    }


}
