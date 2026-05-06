using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.Users;

public class ProfileDto
{
	public Guid UserId { get; set; }
	public string Username { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Role { get; set; } = null!;
	public string? School { get; set; }
	public int? Grade { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime? LastLoginAt { get; set; }
}

public class UpdateProfileRequest
{
	[EmailAddress] public string? Email { get; set; }
	public string? School { get; set; }

	[Range(10, 12)] public int? Grade { get; set; }
}