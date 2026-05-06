using AutoMapper;
using LuyenThiTiengAnh.DTOs.ExamAttempts;
using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class ProgressService : IProgressService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProgressService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ProgressOverviewDto> GetOverviewAsync(Guid studentId)
    {
        var attempts = await _unitOfWork.ExamAttempts.Query()
            .Include(a => a.ExamResult)
            .Include(a => a.StudentAnswers)
                .ThenInclude(sa => sa.ExamQuestion)
                .ThenInclude(eq => eq.Question)
            .Where(a => a.StudentId == studentId && a.IsSubmitted)
            .AsNoTracking()
            .ToListAsync();

        var scores = attempts
            .Where(a => a.ExamResult is not null)
            .Select(a => a.ExamResult!.Score)
            .ToList();

        var allAnswers = attempts.SelectMany(a => a.StudentAnswers).ToList();

        var skillProgress = allAnswers
            .GroupBy(sa => sa.ExamQuestion.Question.Skill)
            .Select(g => new SkillProgressDto
            {
                Skill = g.Key.ToString(),
                TotalAnswered = g.Count(),
                TotalCorrect = g.Count(sa => sa.IsCorrect),
                CorrectRate = g.Count() > 0
                    ? Math.Round((decimal)g.Count(sa => sa.IsCorrect) / g.Count() * 100, 1)
                    : 0
            }).ToList();

        return new ProgressOverviewDto
        {
            TotalAttempts = attempts.Count,
            CompletedAttempts = attempts.Count(a => a.IsSubmitted),
            AverageScore = scores.Any() ? Math.Round(scores.Average(), 2) : null,
            BestScore = scores.Any() ? scores.Max() : null,
            LatestScore = scores.Any() ? scores.Last() : null,
            SkillProgress = skillProgress
        };
    }

    public async Task<PagedResult<AttemptHistoryDto>> GetHistoryAsync(
        Guid studentId, int page, int pageSize)
    {
        var query = _unitOfWork.ExamAttempts.Query()
            .Include(a => a.ExamCode).ThenInclude(ec => ec.Exam)
            .Include(a => a.ExamResult)
            .Where(a => a.StudentId == studentId)
            .AsNoTracking();

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.StartTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<AttemptHistoryDto>
        {
            Items = _mapper.Map<List<AttemptHistoryDto>>(items),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<List<ScoreTrendDto>> GetScoreTrendAsync(Guid studentId)
    {
        var attempts = await _unitOfWork.ExamAttempts.Query()
            .Include(a => a.ExamCode).ThenInclude(ec => ec.Exam)
            .Include(a => a.ExamResult)
            .Where(a => a.StudentId    == studentId
                     && a.IsSubmitted
                     && a.ExamResult   != null)
            .OrderBy(a => a.SubmitTime)
            .AsNoTracking()
            .ToListAsync();

        return attempts.Select(a => new ScoreTrendDto
        {
            AttemptDate = a.SubmitTime!.Value,
            ExamTitle = a.ExamCode.Exam.Title,
            Score = a.ExamResult!.Score
        }).ToList();
    }

    public async Task<List<WeakTopicSummaryDto>> GetWeakTopicsAsync(Guid studentId)
    {
        var answers = await _unitOfWork.StudentAnswers.Query()
            .Include(sa => sa.Attempt)
            .Include(sa => sa.ExamQuestion)
                .ThenInclude(eq => eq.Question)
            .Where(sa => sa.Attempt.StudentId == studentId)
            .AsNoTracking()
            .ToListAsync();

        return answers
            .GroupBy(sa => new
            {
                sa.ExamQuestion.Question.Topic,
                sa.ExamQuestion.Question.Skill
            })
            .Select(g => new WeakTopicSummaryDto
            {
                Topic = g.Key.Topic,
                Skill = g.Key.Skill.ToString(),
                TotalWrong = g.Count(sa => !sa.IsCorrect),
                WrongRate = g.Count() > 0
                    ? Math.Round((decimal)g.Count(sa => !sa.IsCorrect) / g.Count() * 100, 1)
                    : 0
            })
            .Where(w => w.WrongRate >= 40)
            .OrderByDescending(w => w.WrongRate)
            .ToList();
    }
}
