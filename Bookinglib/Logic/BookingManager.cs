using System;
using System.Collections.Generic;
using System.Linq;
using Bookinglib.Domain;
using Bookinglib.Logic;


namespace Bookinglib.Logic
{
    
public class BookingManager // business rules should be here
{
    //Properties
    private readonly List<Booking> _bookings;     
    public BookingManager()
    {
        _bookings = new List<Booking>();
    }

    // Methods
    public IReadOnlyList<Booking> GetBookings()
    {
        return _bookings.ToList();
    }

    public Booking CreateBooking(BookingRequest bookingRequest)
    {
        
        
        // Guard Clauses
        if(bookingRequest.Room != null)
            throw new BookingConflictException("Room must exits");
        else if(bookingRequest.Start >= bookingRequest.End)
            throw new BookingConflictException("Invalid time range");

        bool overlaps = _bookings.Any(b => b.Room == bookingRequest.Room &&
                            b.Status == BookingStatus.Confirmed &&
                            bookingRequest.Start < b.End && bookingRequest.End > bookingRequest.Start);
        
        var room = _bookings.FirstOrDefault(r => r.Room.Id == r.Room.Id);

        if (room is null)
        {
            throw new BookingConflictException("Conference room not found.");
        }

        if(overlaps)
        {
            throw new BookingConflictException("Booking conflicts with an existing booking.");
        }

        Booking booking = new Booking(bookingRequest.Room, bookingRequest.Start, bookingRequest.End);
        booking.Confirm();
        _bookings.Add(booking);

        return booking;

    }


}}