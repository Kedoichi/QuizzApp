using QuizApp.Infrastructure;
using QuizApp.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddInfrastructureServices(builder.Configuration);

// Set up CORS policy to allow all origins, methods, and headers (use more restrictive policies in production).
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder
            .AllowAnyOrigin()   // Allows any origin (e.g., localhost or deployed frontend domain)
            .AllowAnyHeader()   // Allows any headers (like Content-Type, Authorization, etc.)
            .AllowAnyMethod();  // Allows any HTTP method (GET, POST, PUT, DELETE)
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Add custom logging middleware
app.UseMiddleware<RequestLoggingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Enable Swagger for API documentation during development
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS policy for requests
app.UseCors("AllowFrontend");

// Ensure HTTPS is used (comment out if not needed in local dev)
app.UseHttpsRedirection();

// Enable authorization middleware (if applicable in your app)
app.UseAuthorization();

// Map controller routes
app.MapControllers();

// Start the web application
app.Run();
