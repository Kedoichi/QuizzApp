using System.Text;

namespace QuizApp.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log detailed request information including origin
        var origin = context.Request.Headers["Origin"].ToString();
        var referer = context.Request.Headers["Referer"].ToString();
        var userAgent = context.Request.Headers["User-Agent"].ToString();
        var ipAddress = context.Connection.RemoteIpAddress?.ToString();

        _logger.LogInformation(
            "\n--------------------\n" +
            "Incoming Request:\n" +
            $"Time: {DateTime.Now}\n" +
            $"IP Address: {ipAddress}\n" +
            $"Origin: {origin}\n" +
            $"Referer: {referer}\n" +
            $"User Agent: {userAgent}\n" +
            $"Path: {context.Request.Path}\n" +
            $"Method: {context.Request.Method}\n" +
            "--------------------");

        // Continue with the request
        await _next(context);

        // Log response status
        _logger.LogInformation(
            $"Response Status Code: {context.Response.StatusCode} for {context.Request.Path}");
    }
}