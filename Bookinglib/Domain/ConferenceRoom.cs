

namespace Bookinglib.Domain
{
    public class ConferenceRoom
    {
        public int Id { get; }
        public string Name { get;  }
        public string Type { get; }
        public int Capacity {get;}
        public string Location { get; set; } = "Main Building";
        public bool IsActive { get; set; } = true;
        public ConferenceRoom() {}
        public ConferenceRoom(int id, string name, int capacity, string type)
        {
            Id = id;
            Name = name;
            Type = type;
            Capacity = capacity;
        }
    }

}
