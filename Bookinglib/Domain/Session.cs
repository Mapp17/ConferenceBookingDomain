public class Session
{
    public int Id { get; set; }

    public int Capacity { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }

    public void Validate()
    {
        if (Capacity <= 0)
            throw new ArgumentException("Session capacity must be positive");

        if (EndTime <= StartTime)
            throw new ArgumentException("EndTime must be after StartTime");
    }
}
