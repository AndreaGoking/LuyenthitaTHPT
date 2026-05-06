using LuyenThiTiengAnh.DTOs.Auth;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtHelper   _jwt;
    private readonly IConfiguration _config;

    public AuthService(IUnitOfWork unitOfWork, JwtHelper jwt, IConfiguration config)
    {
        _unitOfWork = unitOfWork;
        _jwt = jwt;
        _config = config;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _unitOfWork.Users.Query()
            .FirstOrDefaultAsync(u => u.Username == request.Username);

		if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
			throw new UnauthorizedAccessException("Tên đăng nhập hoặc mật khẩu không chính xác.");

		if (!user.IsActive)
			throw new UnauthorizedAccessException("Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.");

		// update last login
		user.LastLoginAt = DateTime.UtcNow;
        _unitOfWork.Users.Update(user);

        var accessToken  = _jwt.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.UserId);

        await _unitOfWork.SaveChangesAsync();

        return new LoginResponse
        {
            AccessToken  = accessToken,
            RefreshToken = refreshToken.Token,
            ExpiresAt    = refreshToken.ExpiresAt,
            User = new UserInfoDto
            {
                UserId   = user.UserId,
                Username = user.Username,
                Email    = user.Email,
                Role     = user.Role.ToString()
            }
        };
    }

	public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
	{
		if (await _unitOfWork.Users.AnyAsync(u => u.Username == request.Username))
			throw new InvalidOperationException("Tên đăng nhập đã tồn tại.");

		if (await _unitOfWork.Users.AnyAsync(u => u.Email == request.Email))
			throw new InvalidOperationException("Email đã tồn tại.");

		if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
			throw new ArgumentException("Role không hợp lệ.");

		if (role != UserRole.Student)
			throw new UnauthorizedAccessException("Chỉ được phép đăng ký tài khoản học sinh.");

		if (role == UserRole.Student && (!request.Grade.HasValue || string.IsNullOrWhiteSpace(request.School)))
			throw new ArgumentException("Học sinh phải cung cấp lớp và trường học.");

		var user = new User
		{
			UserId = Guid.NewGuid(),
			Username = request.Username,
			Email = request.Email,
			PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
			Role = role,
			IsActive = true,
			CreatedAt = DateTime.UtcNow
		};

		await _unitOfWork.Users.AddAsync(user);

		if (role == UserRole.Student)
		{
			await _unitOfWork.Students.AddAsync(new Student
			{
				StudentId = user.UserId,
				Grade = request.Grade!.Value,
				School = request.School!
			});
		}

		await _unitOfWork.SaveChangesAsync();

		var accessToken = _jwt.GenerateAccessToken(user);
		var refreshToken = await CreateRefreshTokenAsync(user.UserId);
		await _unitOfWork.SaveChangesAsync();

		return new RegisterResponse
		{
			Success = true,
			Message = "Đăng ký thành công.",
			User = new UserInfoDto
			{
				UserId = user.UserId,
				Username = user.Username,
				Email = user.Email,
				Role = user.Role.ToString()
			},
			AccessToken = accessToken,
			RefreshToken = refreshToken.Token,
			ExpiresAt = refreshToken.ExpiresAt
		};
	}

	public async Task<LoginResponse> RefreshTokenAsync(string refreshToken)
    {
        var token = await _unitOfWork.RefreshTokens.Query()
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (token is null || token.IsRevoked || token.ExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token không hợp lệ hoặc đã hết hạn.");

        if (!token.User.IsActive)
            throw new UnauthorizedAccessException("Tài khoản đã bị khóa.");

        // rotate: revoke old, issue new
        token.IsRevoked = true;
        _unitOfWork.RefreshTokens.Update(token);

        var newAccessToken  = _jwt.GenerateAccessToken(token.User);
        var newRefreshToken = await CreateRefreshTokenAsync(token.User.UserId);

        await _unitOfWork.SaveChangesAsync();

        return new LoginResponse
        {
            AccessToken  = newAccessToken,
            RefreshToken = newRefreshToken.Token,
            ExpiresAt    = newRefreshToken.ExpiresAt,
            User = new UserInfoDto
            {
                UserId   = token.User.UserId,
                Username = token.User.Username,
                Email    = token.User.Email,
                Role     = token.User.Role.ToString()
            }
        };
    }

    public async Task RevokeTokenAsync(string refreshToken)
    {
        var token = await _unitOfWork.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (token is null) return;

        token.IsRevoked = true;
        _unitOfWork.RefreshTokens.Update(token);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("Không tìm thấy người dùng.");

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Mật khẩu hiện tại không đúng.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        _unitOfWork.Users.Update(user);

        // revoke all refresh tokens when password changes
        var tokens = await _unitOfWork.RefreshTokens.FindAsync(rt => rt.UserId == userId && !rt.IsRevoked);
        foreach (var t in tokens) { t.IsRevoked = true; _unitOfWork.RefreshTokens.Update(t); }

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        // In production: generate reset token, send email
        // Here we validate email exists and return without exposing info
        var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null) return; // silent — don't reveal if email exists
        // TODO: send reset email with signed token
        await Task.CompletedTask;
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request)
    {
        // TODO: validate signed reset token from email link
        var user = await _unitOfWork.Users.FirstOrDefaultAsync(u => u.Email == request.Email)
            ?? throw new KeyNotFoundException("Email không hợp lệ.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    // ── Private helpers ──────────────────────────────────────────
    private async Task<RefreshToken> CreateRefreshTokenAsync(Guid userId)
    {
        var expiryDays = int.Parse(_config["Jwt:RefreshTokenExpiryDays"] ?? "7");
        var token = new RefreshToken
        {
            UserId    = userId,
            Token     = _jwt.GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(expiryDays)
        };
        await _unitOfWork.RefreshTokens.AddAsync(token);
        return token;
    }
}
