using System;
using Bookinglib.Domain;
using api.Services;
using Bookinglib.Persistence;
using ConferenceBookingDomain.api.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using api.Hubs;


var builder = WebApplication.CreateBuilder(args);

var dataDirectory = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data"
);

builder.Services.AddDbContext<BookingAppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
.AddEntityFrameworkStores<BookingAppDbContext>().AddDefaultTokenProviders();


builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IBookingRepository, EfBookingRepository>();
builder.Services.AddScoped<IRoomRepository, EfRoomRepository>();


builder.Services.AddSingleton<BookingFileStore>(
    new BookingFileStore(dataDirectory)
);


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<TokenService>();
builder.Services.AddSignalR();

// Configure JWT authentication Swagger to include the Authorization header
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}
).AddJwtBearer(options =>
{
    var jwt = builder.Configuration.GetSection("Jwt");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true, 

        ValidIssuer = jwt["Issuer"],
        ValidAudience = jwt["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"])
        )
    
    };
})
;

builder.Services.AddCors ( options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173","http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowCredentials()
        .WithMethods("GET", "POST", "PUT", "DELETE");
    });
});


var app = builder.Build();

app.UseCors("AllowReactApp"); 

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<BookingAppDbContext>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    await context.Database.MigrateAsync();  

    await RoomSeeder.SeedAsync(context);
    await IdentitySeeder.SeedAsync(userManager, roleManager);
}


app.UseAuthentication();
app.UseAuthorization();
app.UseRouting();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.MapControllers();
app.MapHub<BookingHub>("/hubs/bookings");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.Run();

