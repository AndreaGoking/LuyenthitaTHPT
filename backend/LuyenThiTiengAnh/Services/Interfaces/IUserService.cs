using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IUserService
	{
		Task<PagedResult<UserListDto>> GetUsersAsync(UserFilterRequest filter);
		Task<UserDto> GetByIdAsync(Guid userId);
		Task<UserDto> CreateUserAsync(CreateUserRequest request);
		Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request);
		Task<bool> DeactivateUserAsync(Guid userId);
		Task<bool> ActivateUserAsync(Guid userId);
		Task AssignRoleAsync(Guid userId, AssignRoleRequest request);
	}
}
