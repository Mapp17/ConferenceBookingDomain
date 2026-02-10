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
        await CreateUser(userManager, "Employee1", "Employee123!", "Employee");
        await CreateUser(userManager, "Employee2", "Employee456!", "Employee");
        await CreateUser(userManager, "AdminUser", "Admin123!", "Admin");
        await CreateUser(userManager, "ReceptionistUser", "Reception123!", "Receptionist");
        await CreateUser(userManager, "FacilitiesManagerUser", "Facilities123!", "FacilitiesManager");
            
    }

    private static async Task CreateUser(
        UserManager<ApplicationUser> userManager,
        string username,
        string password,
        string role)
    {
        var user = await userManager.FindByNameAsync(username);
        if (user != null) return;

        user = new ApplicationUser
        {
            UserName = username,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, role);
        }
    }
    
    
}