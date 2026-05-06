using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using LuyenThiTiengAnh.Models;
using Microsoft.IdentityModel.Tokens;

namespace LuyenThiTiengAnh.Helpers;

public class JwtHelper
{
	private readonly IConfiguration _config;

	public JwtHelper(IConfiguration config) => _config = config;

	public string GenerateAccessToken(User user)
	{
		var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
		var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
		var expires = DateTime.UtcNow.AddMinutes(
						  double.Parse(_config["Jwt:AccessTokenExpiryMinutes"] ?? "60"));

		var claims = new[]
		{
			new Claim(JwtRegisteredClaimNames.Sub,   user.UserId.ToString()),
			new Claim(JwtRegisteredClaimNames.Email, user.Email),
			new Claim(ClaimTypes.Name,               user.Username),
			new Claim(ClaimTypes.Role,               user.Role.ToString()),
			new Claim(JwtRegisteredClaimNames.Jti,   Guid.NewGuid().ToString())
		};

		var token = new JwtSecurityToken(
			issuer: _config["Jwt:Issuer"],
			audience: _config["Jwt:Audience"],
			claims: claims,
			expires: expires,
			signingCredentials: creds);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}

	public string GenerateRefreshToken()
	{
		var bytes = new byte[64];
		RandomNumberGenerator.Fill(bytes);
		return Convert.ToBase64String(bytes);
	}

	public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
	{
		var parameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = false,   // allow expired
			ValidateIssuerSigningKey = true,
			ValidIssuer = _config["Jwt:Issuer"],
			ValidAudience = _config["Jwt:Audience"],
			IssuerSigningKey = new SymmetricSecurityKey(
										   Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!))
		};

		try
		{
			var principal = new JwtSecurityTokenHandler()
				.ValidateToken(token, parameters, out _);
			return principal;
		}
		catch
		{
			return null;
		}
	}
}