using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace LuyenThiTiengAnh.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
	protected Guid CurrentUserId =>
		Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
			?? throw new UnauthorizedAccessException("Không tìm thấy thông tin người dùng."));

	protected string CurrentUserRole =>
		User.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
}