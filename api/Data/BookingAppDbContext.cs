using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Bookinglib.Domain;

public class BookingAppDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
{
    public BookingAppDbContext(DbContextOptions<BookingAppDbContext> options) : base (options) {}

    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ConferenceRoom> ConferenceRooms { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Booking>()
            .HasKey(b => b.Id);
        builder.Entity<ConferenceRoom>()
            .HasKey(cr => cr.Id);
    }

}