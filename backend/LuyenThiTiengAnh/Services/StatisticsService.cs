using LuyenThiTiengAnh.DTOs.Exams;
using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class StatisticsService : IStatisticsService
{
    private readonly IUnitOfWork _unitOfWork;

    public StatisticsService(IUnitOfWork uow) => _unitOfWork = uow;

    public async Task<SystemOverviewDto> GetOverviewAsync() => new SystemOverviewDto
    {
        TotalUsers     = await _unitOfWork.Users.CountAsync(),
        TotalTeachers  = await _unitOfWork.Teachers.CountAsync(),
        TotalStudents  = await _unitOfWork.Students.CountAsync(),
        TotalQuestions = await _unitOfWork.Questions.CountAsync(),
        TotalExams     = await _unitOfWork.Exams.CountAsync(),
        ActiveExams    = await _unitOfWork.Exams.CountAsync(e => e.Status == ExamStatus.Active),
        TotalAttempts  = await _unitOfWork.ExamAttempts.CountAsync()
    };

	public async Task<PagedResult<ExamParticipantDto>> GetParticipantsAsync(
	Guid examId, int page, int pageSize)
	{
		var query = _unitOfWork.ExamAttempts.Query()
			.Include(a => a.Student)
				.ThenInclude(s => s.User)
			.Include(a => a.ExamCode)
			.Include(a => a.ExamResult)
			.Where(a => a.ExamCode.ExamId == examId)
			.AsNoTracking();

		var total = await query.CountAsync();
		var items = await query
			.OrderBy(a => a.StartTime)
			.Skip((page - 1) * pageSize)
			.Take(pageSize)
			.ToListAsync();

		return new PagedResult<ExamParticipantDto>
		{
			Items = items.Select(a => new ExamParticipantDto
			{
				StudentUsername = a.Student.User.Username,
				StudentEmail = a.Student.User.Email,
				School = a.Student.School ?? "",
				Grade = a.Student.Grade,
				CodeNumber = a.ExamCode.CodeNumber,
				StartTime = a.StartTime,
				IsSubmitted = a.IsSubmitted,
				IsAutoSubmitted = a.IsAutoSubmitted,
				Score = a.ExamResult?.Score
			}).ToList(),
			TotalCount = total,
			Page = page,
			PageSize = pageSize
		};
	}

	public async Task<SubmissionStatusDto> GetSubmissionStatusAsync(Guid examId)
    {
        var attempts = await _unitOfWork.ExamAttempts.Query()
            .Include(a => a.ExamCode)
            .Where(a => a.ExamCode.ExamId == examId)
            .ToListAsync();

        return new SubmissionStatusDto
        {
            TotalParticipants = attempts.Count,
            Submitted         = attempts.Count(a => a.IsSubmitted),
            AutoSubmitted     = attempts.Count(a => a.IsAutoSubmitted),
            InProgress        = attempts.Count(a => !a.IsSubmitted)
        };
    }

    public async Task<List<ScoreDistributionDto>> GetScoreChartAsync(Guid examId)
    {
        var scores = await _unitOfWork.ExamResults.Query()
            .Include(r => r.Attempt).ThenInclude(a => a.ExamCode)
            .Where(r => r.Attempt.ExamCode.ExamId == examId)
            .Select(r => r.Score)
            .ToListAsync();

        var bands = new[]
        {
            ("Dưới 2",    0m,   2m),
            ("2 – 3.9",   2m,   4m),
            ("4 – 4.9",   4m,   5m),
            ("5 – 6.4",   5m,   6.5m),
            ("6.5 – 7.9", 6.5m, 8m),
            ("8 – 10",    8m,   10.01m)
        };

        return bands.Select(b => new ScoreDistributionDto
        {
            ScoreBand    = b.Item1,
            StudentCount = scores.Count(s => s >= b.Item2 && s < b.Item3),
            Percentage   = scores.Count > 0
                ? Math.Round(scores.Count(s => s >= b.Item2 && s < b.Item3) * 100m / scores.Count, 1)
                : 0
        }).ToList();
    }

    public async Task<UserCountDto> GetUserCountAsync() => new UserCountDto
    {
        TotalUsers  = await _unitOfWork.Users.CountAsync(),
        Admins      = await _unitOfWork.Users.CountAsync(u => u.Role == UserRole.Admin),
        Teachers    = await _unitOfWork.Users.CountAsync(u => u.Role == UserRole.Teacher),
        Students    = await _unitOfWork.Users.CountAsync(u => u.Role == UserRole.Student),
        ActiveUsers = await _unitOfWork.Users.CountAsync(u => u.IsActive),
        LockedUsers = await _unitOfWork.Users.CountAsync(u => !u.IsActive)
    };
}
