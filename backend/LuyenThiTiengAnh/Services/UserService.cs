using AutoMapper;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

	public async Task<PagedResult<UserListDto>> GetUsersAsync(UserFilterRequest filter)
	{
		var query = _unitOfWork.Users.Query().AsNoTracking();

		if (!string.IsNullOrWhiteSpace(filter.Role))
		{
			if (Enum.TryParse<UserRole>(filter.Role, true, out var role))
				query = query.Where(u => u.Role == role);
		}

		if (filter.IsActive.HasValue)
			query = query.Where(u => u.IsActive == filter.IsActive.Value);

		if (!string.IsNullOrWhiteSpace(filter.Search))
		{
			var s = filter.Search.ToLower();
			query = query.Where(u => u.Username.ToLower().Contains(s)
								  || u.Email.ToLower().Contains(s));
		}

		var total = await query.CountAsync();
		var items = await query
			.OrderBy(u => u.CreatedAt)
			.Skip((filter.Page - 1) * filter.PageSize)
			.Take(filter.PageSize)
			.ToListAsync();

		return new PagedResult<UserListDto>
		{
			Items = _mapper.Map<List<UserListDto>>(items),
			TotalCount = total,
			Page = filter.Page,
			PageSize = filter.PageSize
		};
	}

	public async Task<UserDto> GetByIdAsync(Guid userId)
	{
		var user = await _unitOfWork.Users.Query()
			.Include(u => u.Teacher)
			.Include(u => u.Student)
			.FirstOrDefaultAsync(u => u.UserId == userId)
			?? throw new KeyNotFoundException("Không tìm thấy người dùng.");

		return _mapper.Map<UserDto>(user);
	}

	public async Task<UserDto> CreateUserAsync(CreateUserRequest request)
	{
		if (await _unitOfWork.Users.AnyAsync(u => u.Username == request.Username))
			throw new InvalidOperationException("Tên đăng nhập đã tồn tại.");

		if (await _unitOfWork.Users.AnyAsync(u => u.Email == request.Email))
			throw new InvalidOperationException("Email đã tồn tại.");

		if (!Enum.TryParse<UserRole>(request.Role, true, out var role))
			throw new ArgumentException("Role không hợp lệ.");

		var user = new User
		{
			Username = request.Username,
			Email = request.Email,
			PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
			Role = role,
			IsActive = true
		};
		await _unitOfWork.Users.AddAsync(user);

		if (role == UserRole.Teacher)
		{
			if (string.IsNullOrWhiteSpace(request.School))
				throw new ArgumentException("Giáo viên phải có trường.");

			await _unitOfWork.Teachers.AddAsync(new Teacher
			{
				TeacherId = user.UserId,
				School = request.School!
			});
		}
		else if (role == UserRole.Student)
		{
			if (!request.Grade.HasValue || string.IsNullOrWhiteSpace(request.School))
				throw new ArgumentException("Học sinh phải có lớp và trường.");

			await _unitOfWork.Students.AddAsync(new Student
			{
				StudentId = user.UserId,
				Grade = request.Grade!.Value,
				School = request.School!
			});
		}

		await _unitOfWork.SaveChangesAsync();
		return await GetByIdAsync(user.UserId);
	}

	public async Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request)
	{
		var user = await _unitOfWork.Users.Query()
			.Include(u => u.Teacher)
			.Include(u => u.Student)
			.FirstOrDefaultAsync(u => u.UserId == userId)
			?? throw new KeyNotFoundException("Không tìm thấy người dùng.");

		if (!string.IsNullOrWhiteSpace(request.Email))
		{
			if (await _unitOfWork.Users.AnyAsync(u => u.Email == request.Email && u.UserId != userId))
				throw new InvalidOperationException("Email đã tồn tại.");
			user.Email = request.Email;
		}

		if (user.Teacher is not null && request.School is not null)
			user.Teacher.School = request.School;

		if (user.Student is not null)
		{
			if (request.School is not null) user.Student.School = request.School;
			if (request.Grade is not null) user.Student.Grade = request.Grade.Value;
		}

		_unitOfWork.Users.Update(user);
		await _unitOfWork.SaveChangesAsync();
		return _mapper.Map<UserDto>(user);
	}

	public async Task<bool> DeactivateUserAsync(Guid userId)
	{
		var user = await _unitOfWork.Users
			.FirstOrDefaultAsync(u => u.UserId == userId);

		if (user is null)
			return false;

		user.IsActive = false;

		await _unitOfWork.SaveChangesAsync();
		return true;
	}

	public async Task<bool> ActivateUserAsync(Guid userId)
	{
		var user = await _unitOfWork.Users
			.FirstOrDefaultAsync(u => u.UserId == userId);

		if (user is null)
			return false;

		user.IsActive = true;
		await _unitOfWork.SaveChangesAsync();
		return true;
	}

    public async Task AssignRoleAsync(Guid userId, AssignRoleRequest request)
    {
        if (!Enum.TryParse<UserRole>(request.Role, true, out var newRole))
            throw new ArgumentException("Role không hợp lệ.");

        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("Không tìm thấy người dùng.");

        user.Role = newRole;
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }
}

// ── ProfileService ────────────────────────────────────────────────
public class ProfileService : IProfileService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProfileService(IUnitOfWork uow, IMapper mapper)
    {
        _unitOfWork = uow;
        _mapper = mapper;
    }

    public async Task<ProfileDto> GetProfileAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.Query()
            .Include(u => u.Teacher)
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.UserId == userId)
            ?? throw new KeyNotFoundException("Không tìm thấy người dùng.");

        return _mapper.Map<ProfileDto>(user);
    }

    public async Task<ProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _unitOfWork.Users.Query()
            .Include(u => u.Teacher)
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.UserId == userId)
            ?? throw new KeyNotFoundException("Không tìm thấy người dùng.");

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            if (await _unitOfWork.Users.AnyAsync(u => u.Email == request.Email && u.UserId != userId))
                throw new InvalidOperationException("Email đã tồn tại.");
            user.Email = request.Email;
        }

        if (user.Teacher is not null && request.School is not null)
            user.Teacher.School = request.School;

        if (user.Student is not null)
        {
            if (request.School is not null) user.Student.School = request.School;
            if (request.Grade  is not null) user.Student.Grade  = request.Grade.Value;
        }

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<ProfileDto>(user);
    }
}
