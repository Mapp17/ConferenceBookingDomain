using System;
using Bookinglib.Domain;
using Bookinglib.Services;
using Bookinglib.Persistence;

var builder = WebApplication.CreateBuilder(args);

var dataDirectory = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data"
);

builder.Services.AddSingleton<BookingFileStore>(
    new BookingFileStore(dataDirectory)
);
builder.Services.AddSingleton<BookingService>();


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSwaggerGen();



var app = builder.Build();

app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//app.UseHttpsRedirection();
app.Run();

