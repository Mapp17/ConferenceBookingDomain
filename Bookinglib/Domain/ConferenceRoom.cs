

namespace Bookinglib.Domain
{
<<<<<<< HEAD
public class ConferenceRoom
{
    public int Id { get; }
    public string Name { get;  }
    public string Type { get; }
    public int Capacity {get;}
    public ConferenceRoom() {}
    public ConferenceRoom(int id, string name, int capacity, string type)
    {
        Id = id;
        Name = name;
        Type = type;
        Capacity = capacity;
=======
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

        
>>>>>>> 331da30f1d0aa594923dc1a3cd773ed181a577ee
    }

}
