public class ConferenceBookingHandleException : Exception
{
    public ConferenceBookingHandleException() : base("Failed to handle the conference booking operation.")
    {
    }

    public ConferenceBookingHandleException(string message) : base(message)
    {
    }
}

