using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuyenThiTiengAnh.Controllers;

// ── UserController ────────────────────────────────────────────────
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UserController : BaseController
{
	private readonly IUserService _userService;
	public UserController(IUserService userService) => _userService = userService;

	/// <summary>GET /api/users</summary>
	[HttpGet]
	public async Task<IActionResult> GetAll([FromQuery] UserFilterRequest filter)
	{
		var result = await _userService.GetUsersAsync(filter);
		return Ok(ApiResponse<PagedResult<UserListDto>>.Ok(result));
	}

	/// <summary>GET /api/users/{id}</summary>
	[HttpGet("{id:guid}")]
	public async Task<IActionResult> GetById(Guid id)
	{
		var result = await _userService.GetByIdAsync(id);
		return Ok(ApiResponse<UserDto>.Ok(result));
	}

	/// <summary>POST /api/users</summary>
	[HttpPost]
	public async Task<IActionResult> Create([FromBody] CreateUserRequest request)
	{
		var result = await _userService.CreateUserAsync(request);
		return CreatedAtAction(nameof(GetById), new { id = result.UserId },
			ApiResponse<UserDto>.Ok(result, "Tạo tài khoản thành công."));
	}

	/// <summary>PUT /api/users/{id}</summary>
	[HttpPut("{id:guid}")]
	public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
	{
		var result = await _userService.UpdateUserAsync(id, request);
		return Ok(ApiResponse<UserDto>.Ok(result, "Cập nhật thành công."));
	}

	[HttpPatch("{id:guid}/deactivate")]
	public async Task<IActionResult> Deactivate(Guid id)
	{
		var result = await _userService.DeactivateUserAsync(id);

		if (!result)
			return NotFound(ApiResponse.Fail("Không tìm thấy người dùng."));

		return Ok(ApiResponse.Ok("Tài khoản đã bị vô hiệu hóa."));
	}

	[HttpPatch("{id:guid}/activate")]
	public async Task<IActionResult> Activate(Guid id)
	{
		var result = await _userService.ActivateUserAsync(id);

		if (!result)
			return NotFound(ApiResponse.Fail("Không tìm thấy người dùng."));

		return Ok(ApiResponse.Ok("Tài khoản đã được kích hoạt."));
	}

	/// <summary>PATCH /api/users/{id}/role</summary>
	[HttpPatch("{id:guid}/role")]
	public async Task<IActionResult> AssignRole(Guid id, [FromBody] AssignRoleRequest request)
	{
		await _userService.AssignRoleAsync(id, request);
		return Ok(ApiResponse.Ok("Phân quyền thành công."));
	}
}

// ── ProfileController ─────────────────────────────────────────────
[Route("api/profile")]
[Authorize]
public class ProfileController : BaseController
{
	private readonly IProfileService _profileService;
	public ProfileController(IProfileService profileService) => _profileService = profileService;

	/// <summary>GET /api/profile</summary>
	[HttpGet]
	public async Task<IActionResult> GetProfile()
	{
		var result = await _profileService.GetProfileAsync(CurrentUserId);
		return Ok(ApiResponse<ProfileDto>.Ok(result));
	}

	/// <summary>PUT /api/profile</summary>
	[HttpPut]
	public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
	{
		var result = await _profileService.UpdateProfileAsync(CurrentUserId, request);
		return Ok(ApiResponse<ProfileDto>.Ok(result, "Cập nhật hồ sơ thành công."));
	}
}