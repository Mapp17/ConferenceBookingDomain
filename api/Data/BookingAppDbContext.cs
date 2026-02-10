using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class BookingDbContext : IdentityDbContext<ApplicationUser>
{
    public BookingDbContext(DbContextOptions<BookingDbContext> options) : base (options) {}
}