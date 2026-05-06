using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.Users;

// ── Response ────────────────────────────────────────────────────
public class UserDto
{
	public Guid UserId { get; set; }
	public string Username { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Role { get; set; } = null!;
	public bool IsActive { get; set; }
	public DateTime CreatedAt { get; set; }
	public DateTime? LastLoginAt { get; set; }

	// Extra info per role
	public string? School { get; set; }
	public int? Grade { get; set; }
}

public class UserListDto
{
	public Guid UserId { get; set; }
	public string Username { get; set; } = null!;
	public string Email { get; set; } = null!;
	public string Role { get; set; } = null!;
	public bool IsActive { get; set; }
	public DateTime CreatedAt { get; set; }
}

// ── Request ──────────────────────────────────────────────────────
public class CreateUserRequest
{
	[Required, MaxLength(100)] public string Username { get; set; } = null!;
	[Required, EmailAddress] public string Email { get; set; } = null!;
	[Required, MinLength(6)] public string Password { get; set; } = null!;
	[Required] public string Role { get; set; } = null!;   // Admin | Teacher | Student

	// Teacher only
	public string? School { get; set; }

	// Student only
	public int? Grade { get; set; }
}

public class UpdateUserRequest
{
	[EmailAddress] public string? Email { get; set; }
	public string? School { get; set; }
	public int? Grade { get; set; }
}

public class AssignRoleRequest
{
	[Required] public string Role { get; set; } = null!;
}

public class UserFilterRequest
{
	public string? Role { get; set; }
	public bool? IsActive { get; set; }
	public string? Search { get; set; }   // username or email
	public int Page { get; set; } = 1;
	public int PageSize { get; set; } = 20;
}

public class PagedResult<T>
{
	public List<T> Items { get; set; } = new();
	public int TotalCount { get; set; }
	public int Page { get; set; }
	public int PageSize { get; set; }
	public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
}