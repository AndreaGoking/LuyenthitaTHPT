using LuyenThiTiengAnh.DTOs.Auth;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Services.Implementations;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace LuyenThiTiengAnh.Controllers;

[Route("api/auth")]
public class AuthController : BaseController
{
	private readonly IAuthService _authService;
	public AuthController(IAuthService authService) => _authService = authService;

	/// <summary>POST /api/auth/login</summary>
	[HttpPost("login"), EnableRateLimiting("login")]
	[AllowAnonymous]
	public async Task<IActionResult> Login([FromBody] LoginRequest request)
	{
		if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
		{
			return BadRequest(ApiResponse<LoginResponse>.Fail("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu."));
		}

		try
		{
			var result = await _authService.LoginAsync(request);
			return Ok(ApiResponse<LoginResponse>.Ok(result, "Đăng nhập thành công"));
		}
		catch (UnauthorizedAccessException ex)
		{
			// Bắt lỗi từ AuthService (tài khoản bị khóa, sai mật khẩu, etc.)
			return Unauthorized(ApiResponse<LoginResponse>.Fail(ex.Message));
		}
		catch (Exception ex)
		{
			return StatusCode(500, ApiResponse<LoginResponse>.Fail("Đã xảy ra lỗi hệ thống."));
		}
	}

	[HttpPost("register")]
	[AllowAnonymous]
	public async Task<IActionResult> Register([FromBody] RegisterRequest request)
	{
		if (request == null || string.IsNullOrWhiteSpace(request.Username))
		{
			return BadRequest(ApiResponse<RegisterResponse>.Fail("Dữ liệu đăng ký không hợp lệ."));
		}

		var result = await _authService.RegisterAsync(request);

		if (result == null)
		{
			return BadRequest(ApiResponse<RegisterResponse>.Fail("Đăng ký thất bại. Tên đăng nhập hoặc email đã tồn tại."));
		}

		return Ok(ApiResponse<RegisterResponse>.Ok(result, "Đăng ký thành công."));
	}

	/// <summary>POST /api/auth/refresh-token</summary>
	[HttpPost("refresh-token")]
	[AllowAnonymous]
	public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
	{
		var result = await _authService.RefreshTokenAsync(request.RefreshToken);

		if (result == null)
		{
			return Unauthorized(ApiResponse<LoginResponse>.Fail("Refresh token không hợp lệ hoặc đã hết hạn."));
		}

		return Ok(ApiResponse<LoginResponse>.Ok(result));
	}

	/// <summary>POST /api/auth/logout</summary>
	[HttpPost("logout")]
	[Authorize]
	public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
	{
		await _authService.RevokeTokenAsync(request.RefreshToken);
		return Ok(ApiResponse.Ok("Đăng xuất thành công."));
	}

	/// <summary>POST /api/auth/change-password</summary>
	[HttpPost("change-password")]
	[Authorize]
	public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
	{
		if (request == null || string.IsNullOrWhiteSpace(request.CurrentPassword))
		{
			return BadRequest(ApiResponse.Fail("Vui lòng nhập mật khẩu hiện tại."));
		}

		try
		{
			await _authService.ChangePasswordAsync(CurrentUserId, request);
			return Ok(ApiResponse.Ok("Đổi mật khẩu thành công."));
		}
		catch (UnauthorizedAccessException)
		{
			return Unauthorized(ApiResponse.Fail("Mật khẩu hiện tại không đúng."));
		}
		catch (Exception ex)
		{
			return BadRequest(ApiResponse.Fail(ex.Message));
		}
	}

	/// <summary>POST /api/auth/forgot-password</summary>
	[HttpPost("forgot-password")]
	[AllowAnonymous]
	public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
	{
		if (string.IsNullOrWhiteSpace(request?.Email))
		{
			return BadRequest(ApiResponse.Fail("Email không được để trống."));
		}

		await _authService.ForgotPasswordAsync(request);

		return Ok(ApiResponse.Ok("Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu."));
	}

	/// <summary>POST /api/auth/reset-password</summary>
	[HttpPost("reset-password")]
	[AllowAnonymous]
	public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
	{
		await _authService.ResetPasswordAsync(request);
		return Ok(ApiResponse.Ok("Đặt lại mật khẩu thành công."));
	}
}