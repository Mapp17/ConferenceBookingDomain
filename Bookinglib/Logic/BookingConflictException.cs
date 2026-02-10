
using Bookinglib;
namespace Bookinglib.Logic
{
    public class BookingConflictException : Exception
    {
        public BookingConflictException(string message) : base(message)
        {
        }

    }
}
