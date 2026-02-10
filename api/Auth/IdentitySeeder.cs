using Microsoft.AspNetCore.Identity;

public static class IdentitySeeder
{
    public static async Task SeedAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        string[] roles = 
        {
            "Admin",
            "Employee", 
            "Receptionist", 
            "Facility Manager"
        };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2️⃣ Seed users
        await CreateUser(userManager, "employee@company.com", "Employee123!", "Employee");
        await CreateUser(userManager, "employee@company.com", "Employee456!", "Employee");
        await CreateUser(userManager, "admin@company.com", "Admin123!", "Admin");
        await CreateUser(userManager, "reception@company.com", "Reception123!", "Receptionist");
        await CreateUser(userManager, "facilities@company.com", "Facilities123!", "FacilitiesManager");
            
    }

    private static async Task CreateUser(
        UserManager<ApplicationUser> userManager,
        string email,
        string password,
        string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user != null) return;

        user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, role);
        }
    }
    
    
}