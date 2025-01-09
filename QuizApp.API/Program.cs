using QuizApp.Infrastructure;
using QuizApp.API.Middleware;

var builder = WebApplication.CreateBuilder(args);
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

app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers()
app.Run();
