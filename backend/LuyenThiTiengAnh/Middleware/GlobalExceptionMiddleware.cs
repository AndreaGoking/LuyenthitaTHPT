using System.Net;
using System.Text.Json;
using LuyenThiTiengAnh.Helpers;

namespace LuyenThiTiengAnh.Middleware;

public class GlobalExceptionMiddleware
{
	private readonly RequestDelegate _next;
	private readonly ILogger<GlobalExceptionMiddleware> _logger;

	public GlobalExceptionMiddleware(
		RequestDelegate next,
		ILogger<GlobalExceptionMiddleware> logger)
	{
		_next = next;
		_logger = logger;
	}

	public async Task InvokeAsync(HttpContext ctx)
	{
		try
		{
			await _next(ctx);
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
			await HandleExceptionAsync(ctx, ex);
		}
	}

	private static Task HandleExceptionAsync(HttpContext ctx, Exception ex)
	{
		var (status, message) = ex switch
		{
			KeyNotFoundException => (HttpStatusCode.NotFound, ex.Message),
			UnauthorizedAccessException => (HttpStatusCode.Forbidden, ex.Message),
			InvalidOperationException => (HttpStatusCode.BadRequest, ex.Message),
			ArgumentException => (HttpStatusCode.BadRequest, ex.Message),
			_ => (HttpStatusCode.InternalServerError, "Lỗi hệ thống, vui lòng thử lại sau.")
		};

		ctx.Response.ContentType = "application/json";
		ctx.Response.StatusCode = (int)status;

		var body = JsonSerializer.Serialize(
			ApiResponse.Fail(message),
			new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

		return ctx.Response.WriteAsync(body);
	}
}