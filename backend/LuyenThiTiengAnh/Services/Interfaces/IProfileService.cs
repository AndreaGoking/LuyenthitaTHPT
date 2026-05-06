using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IProfileService
	{
		Task<ProfileDto> GetProfileAsync(Guid userId);
		Task<ProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
	}
}
