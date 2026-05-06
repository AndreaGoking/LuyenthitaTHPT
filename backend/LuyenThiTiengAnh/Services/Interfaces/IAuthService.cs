using LuyenThiTiengAnh.DTOs.Auth;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IAuthService
	{
		Task<LoginResponse> LoginAsync(LoginRequest request);
		Task<RegisterResponse> RegisterAsync(RegisterRequest request);
		Task<LoginResponse> RefreshTokenAsync(string refreshToken);
		Task RevokeTokenAsync(string refreshToken);
		Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
		Task ForgotPasswordAsync(ForgotPasswordRequest request);
		Task ResetPasswordAsync(ResetPasswordRequest request);
	}
}
