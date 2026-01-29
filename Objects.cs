public record TimeSlot(DateTime StartTime, DateTime EndTime)
    {
        public TimeSlot WithDuration(TimeSpan duration) 
            => new(StartTime, StartTime.Add(duration));
        
        public bool Overlaps(TimeSlot other) 
            => StartTime < other.EndTime && other.StartTime < EndTime;
        
        public TimeSpan Duration => EndTime - StartTime;
        
    }

       public record RoomCapacity
    {
        public int Value { get; }
        
        public RoomCapacity(int capacity)
        {
            if (capacity <= 0)
                throw new ArgumentException("Capacity must be positive", nameof(capacity));
            if (capacity > 100)
                throw new ArgumentException("Capacity cannot exceed 100", nameof(capacity));
            
            Value = capacity;
        }
    }