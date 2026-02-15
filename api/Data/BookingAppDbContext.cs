using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Bookinglib.Domain;

public class BookingAppDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
{
    public BookingAppDbContext(DbContextOptions<BookingAppDbContext> options) : base (options) {}

    public DbSet<Booking> Bookings { get; set; }
    public DbSet<ConferenceRoom> ConferenceRooms { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Session> Sessions { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Booking>()
            .HasOne(b => b.Room)
            .WithMany(cr => cr.Bookings)
            .HasForeignKey(b => b.RoomId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany(u => u.Bookings)
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);


        builder.Entity<ConferenceRoom>()
            .HasKey(cr => cr.Id)
            .HasQueryFilter(cr => cr.IsActive);

        builder.Entity<Session>()
            .HasKey(s => s.Id);
    }

}