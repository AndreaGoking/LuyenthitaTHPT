using System.Text;
using LuyenThiTiengAnh.Data;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Mapping;
using LuyenThiTiengAnh.Middleware;
using LuyenThiTiengAnh.Repositories.Implementations;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Implementations;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

// ════════════════════════════════════════════════════════════════
// FIX 1: BẮT BUỘC đặt TRƯỚC builder.Build()
// Npgsql 6+ mặc định dùng DateTimeOffset, switch này giữ DateTime
// hoạt động như cũ — thiếu dòng này sẽ lỗi runtime khi insert/query
// ════════════════════════════════════════════════════════════════
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// ── Database ─────────────────────────────────────────────────────
// FIX 2: Đổi UseSqlServer → UseNpgsql
//builder.Services.AddDbContext<AppDbContext>(options =>
//	options.UseNpgsql(
//		builder.Configuration.GetConnectionString("DefaultConnection"),
//		npgsql => npgsql.EnableRetryOnFailure(3)));  // Npgsql hỗ trợ retry như SQL Server

var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
					   ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
	options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure(3)));

// ── Repository & Unit of Work ─────────────────────────────────────
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// ── Services ──────────────────────────────────────────────────────
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IQuestionService, QuestionService>();
builder.Services.AddScoped<IReadingPassageService, ReadingPassageService>();
builder.Services.AddScoped<IExamMatrixService, ExamMatrixService>();
builder.Services.AddScoped<IExamService, ExamService>();
builder.Services.AddScoped<IExamCodeService, ExamCodeService>();
builder.Services.AddScoped<IExamAttemptService, ExamAttemptService>();
builder.Services.AddScoped<IExamResultService, ExamResultService>();
builder.Services.AddScoped<IStatisticsService, StatisticsService>();
builder.Services.AddScoped<IQuestionStatisticsService, QuestionStatisticsService>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<IStudyMaterialService, StudyMaterialService>();

// ── rate limiting ───────────────────────────────────────────────────────
builder.Services.AddRateLimiter(opt =>
	opt.AddFixedWindowLimiter("login", o => {
		o.PermitLimit = 5;
		o.Window = TimeSpan.FromMinutes(1);
	}));

// ── Helpers ───────────────────────────────────────────────────────
builder.Services.AddSingleton<JwtHelper>();

// ── AutoMapper ────────────────────────────────────────────────────
builder.Services.AddAutoMapper(typeof(MappingProfile));

// ── JWT Authentication ────────────────────────────────────────────
var jwtSecret = builder.Configuration["Jwt:Secret"]
	?? throw new InvalidOperationException("Jwt:Secret không được để trống.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
	.AddJwtBearer(options =>
	{
		options.TokenValidationParameters = new TokenValidationParameters
		{
			ValidateIssuer = true,
			ValidateAudience = true,
			ValidateLifetime = true,
			ValidateIssuerSigningKey = true,
			ValidIssuer = builder.Configuration["Jwt:Issuer"],
			ValidAudience = builder.Configuration["Jwt:Audience"],
			IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
			ClockSkew = TimeSpan.Zero
		};
	});

builder.Services.AddAuthorization();

// ── Controllers ───────────────────────────────────────────────────
builder.Services.AddControllers()
	.AddJsonOptions(opts =>
	{
		opts.JsonSerializerOptions.PropertyNamingPolicy =
			System.Text.Json.JsonNamingPolicy.CamelCase;
	});

// ── CORS ──────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
		policy.WithOrigins(
				builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
					?? new[] { "http://localhost:3000", "http://localhost:5173" })
			  .AllowAnyHeader()
			  .AllowAnyMethod()
			  .AllowCredentials());
});

// ── Swagger ───────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
	c.SwaggerDoc("v1", new OpenApiInfo
	{
		Title = "Luyện Thi Tiếng Anh THPT API",
		Version = "v1",
		Description = "API cho hệ thống luyện thi và thi thử tiếng Anh THPT"
	});

	c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
	{
		Name = "Authorization",
		Type = SecuritySchemeType.Http,
		Scheme = "bearer",
		BearerFormat = "JWT",
		In = ParameterLocation.Header,
		Description = "Nhập JWT token: Bearer {token}"
	});

	c.AddSecurityRequirement(new OpenApiSecurityRequirement
	{
		{
			new OpenApiSecurityScheme
			{
				Reference = new OpenApiReference
				{
					Type = ReferenceType.SecurityScheme,
					Id   = "Bearer"
				}
			},
			Array.Empty<string>()
		}
	});
});

// ── Build ─────────────────────────────────────────────────────────
var app = builder.Build();

// ── Middleware Pipeline ───────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

// FIX 3: Swagger luôn bật (kể cả production trên Railway/Somee)
// để đồng nghiệp có thể test API qua browser
app.UseSwagger();
app.UseSwaggerUI(c =>
{
	c.SwaggerEndpoint("/swagger/v1/swagger.json", "LuyenThiTiengAnh API v1");
	c.RoutePrefix = string.Empty;   // Swagger tại root "/"
});

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// FIX 4: Auto-migrate chạy MỌI môi trường (không chỉ dev)
// Cần thiết để tạo bảng lần đầu khi deploy lên cloud
//using (var scope = app.Services.CreateScope())
//{
//	var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
//	await db.Database.MigrateAsync();
//}

app.Run();