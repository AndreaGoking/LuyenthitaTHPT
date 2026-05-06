using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.Auth;

public class LoginRequest
{
	[Required] public string Username { get; set; } = null!;
	[Required] public string Password { get; set; } = null!;
}

public class RegisterRequest
{
	[Required, MaxLength(100)] public string Username { get; set; } = null!;
	[Required, EmailAddress] public string Email { get; set; } = null!;
	[Required, MinLength(6)] public string Password { get; set; } = null!;
	[Required, Compare(nameof(Password))] public string ConfirmPassword { get; set; } = null!;
	[Required]
	[RegularExpression("^(Teacher|Student)$")]
	public string Role { get; set; } = null!;
	public string? School { get; set; }
	public int? Grade { get; set; }
}

public class LoginResponse
{
	public string AccessToken { get; set; } = null!;
	public string RefreshToken { get; set; } = null!;
	public DateTime ExpiresAt { get; set; }
	public UserInfoDto User { get; set; } = null!;
}

public class RegisterResponse
{
	public bool Success { get; set; }
	public string Message { get; set; } = null!;
	public UserInfoDto? User { get; set; }
	public DateTime ExpiresAt { get; set; }
	// Optional: auto-login after register
	public string? AccessToken { get; set; }
	public string? RefreshToken { get; set; }
}

public class UserInfoDto
{
	public Guid UserId { get; set; }
	public string Username { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Role { get; set; } = null!;
}

public class RefreshTokenRequest
{
	[Required] public string RefreshToken { get; set; } = null!;
}

public class ChangePasswordRequest
{
	[Required] public string CurrentPassword { get; set; } = null!;
	[Required, MinLength(6)] public string NewPassword { get; set; } = null!;
	[Required, Compare(nameof(NewPassword))] public string ConfirmPassword { get; set; } = null!;
}

public class ForgotPasswordRequest
{
	[Required, EmailAddress] public string Email { get; set; } = null!;
}

public class ResetPasswordRequest
{
	[Required] public string Token { get; set; } = null!;
	[Required, EmailAddress] public string Email { get; set; } = null!;
	[Required, MinLength(6)] public string NewPassword { get; set; } = null!;
	[Required, Compare(nameof(NewPassword))] public string ConfirmPassword { get; set; } = null!;
}