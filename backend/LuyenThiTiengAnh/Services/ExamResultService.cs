using AutoMapper;
using LuyenThiTiengAnh.DTOs.ExamResults;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class ExamResultService : IExamResultService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper     _mapper;

    public ExamResultService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork    = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ExamResultDto> GetResultAsync(Guid attemptId, Guid userId)
    {
        var result = await _unitOfWork.ExamResults.Query()
            .Include(r => r.Attempt)
                .ThenInclude(a => a.ExamCode)
                .ThenInclude(ec => ec.Exam)
            .FirstOrDefaultAsync(r => r.AttemptId == attemptId)
            ?? throw new KeyNotFoundException("Không tìm thấy kết quả.");

        await EnsureAccessAsync(result.Attempt, userId);
        return _mapper.Map<ExamResultDto>(result);
    }

    public async Task<ResultDetailDto> GetDetailAsync(Guid attemptId, Guid userId)
    {
        var result = await _unitOfWork.ExamResults.Query()
            .Include(r => r.Attempt)
                .ThenInclude(a => a.ExamCode)
                .ThenInclude(ec => ec.Exam)
            .FirstOrDefaultAsync(r => r.AttemptId == attemptId)
            ?? throw new KeyNotFoundException("Không tìm thấy kết quả.");

        await EnsureAccessAsync(result.Attempt, userId);

        var answers = await _unitOfWork.StudentAnswers.Query()
            .Include(sa => sa.ExamQuestion)
                .ThenInclude(eq => eq.Question)
            .Where(sa => sa.AttemptId == attemptId)
            .OrderBy(sa => sa.ExamQuestion.DisplayOrder)
            .ToListAsync();

        var dto = _mapper.Map<ResultDetailDto>(result);
        dto.Answers = answers.Select(sa => new AnswerDetailDto
        {
            DisplayOrder = sa.ExamQuestion.DisplayOrder,
            QuestionContent = sa.ExamQuestion.Question.Content,
            OptionA = sa.ExamQuestion.Question.OptionA,
            OptionB = sa.ExamQuestion.Question.OptionB,
            OptionC = sa.ExamQuestion.Question.OptionC,
            OptionD = sa.ExamQuestion.Question.OptionD,
            CorrectAnswer = sa.ExamQuestion.Question.CorrectAnswer,
            SelectedOption = sa.SelectedOption,
            IsCorrect = sa.IsCorrect,
            Skill = sa.ExamQuestion.Question.Skill.ToString(),
            Level = sa.ExamQuestion.Question.Level.ToString(),
            Topic = sa.ExamQuestion.Question.Topic
        }).ToList();

        return dto;
    }

    public async Task<List<SkillBreakdownDto>> GetSkillBreakdownAsync(Guid attemptId, Guid userId)
    {
        var attempt = await _unitOfWork.ExamAttempts.GetByIdAsync(attemptId)
            ?? throw new KeyNotFoundException("Không tìm thấy lần thi.");

        await EnsureAccessAsync(attempt, userId);

        var answers = await _unitOfWork.StudentAnswers.Query()
            .Include(sa => sa.ExamQuestion)
                .ThenInclude(eq => eq.Question)
            .Where(sa => sa.AttemptId == attemptId)
            .ToListAsync();

        return answers
            .GroupBy(sa => sa.ExamQuestion.Question.Skill)
            .Select(g => new SkillBreakdownDto
            {
                Skill       = g.Key.ToString(),
                Total       = g.Count(),
                Correct     = g.Count(sa => sa.IsCorrect),
                Wrong       = g.Count(sa => !sa.IsCorrect),
                CorrectRate = g.Count() > 0
                    ? Math.Round((decimal)g.Count(sa => sa.IsCorrect) / g.Count() * 100, 1)
                    : 0
            }).ToList();
    }

    public async Task<List<WeakTopicDto>> GetWeakTopicsAsync(Guid attemptId, Guid userId)
    {
        var attempt = await _unitOfWork.ExamAttempts.GetByIdAsync(attemptId)
            ?? throw new KeyNotFoundException("Không tìm thấy lần thi.");

        await EnsureAccessAsync(attempt, userId);

        var answers = await _unitOfWork.StudentAnswers.Query()
            .Include(sa => sa.ExamQuestion)
                .ThenInclude(eq => eq.Question)
            .Where(sa => sa.AttemptId == attemptId)
            .ToListAsync();

        return answers
            .GroupBy(sa => new { sa.ExamQuestion.Question.Topic, sa.ExamQuestion.Question.Skill })
            .Where(g => g.Any(sa => !sa.IsCorrect))
            .Select(g => new WeakTopicDto
            {
                Topic = g.Key.Topic,
                Skill = g.Key.Skill.ToString(),
                Total = g.Count(),
                Wrong = g.Count(sa => !sa.IsCorrect),
                WrongRate = Math.Round((decimal)g.Count(sa => !sa.IsCorrect) / g.Count() * 100, 1)
            })
            .OrderByDescending(w => w.WrongRate)
            .ToList();
    }

    // ── Private ──────────────────────────────────────────────────
    private async Task EnsureAccessAsync(Models.ExamAttempt attempt, Guid userId)
    {
        if (attempt.StudentId == userId) return;
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user?.Role is UserRole.Admin or UserRole.Teacher) return;
        throw new UnauthorizedAccessException("Không có quyền xem kết quả này.");
    }
}
