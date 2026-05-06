using LuyenThiTiengAnh.Models.Enums;

namespace LuyenThiTiengAnh.Models;

public class User
{
	public Guid UserId { get; set; } = Guid.NewGuid();
	public string Username { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string PasswordHash { get; set; } = null!;
	public UserRole Role { get; set; }
	public bool IsActive { get; set; } = true;
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	public DateTime? LastLoginAt { get; set; }

	// Navigation
	public Teacher? Teacher { get; set; }
	public Student? Student { get; set; }
	public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
	//public object ExamAttempts { get; internal set; }
}