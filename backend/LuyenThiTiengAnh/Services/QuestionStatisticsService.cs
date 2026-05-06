using AutoMapper;
using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class QuestionStatisticsService : IQuestionStatisticsService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper     _mapper;

    public QuestionStatisticsService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<QuestionStatisticsDto>> GetAllAsync(
        Guid? examId, int page, int pageSize)
    {
        var query = _unitOfWork.QuestionStatistics.Query()
            .Include(qs => qs.Question)
            .AsNoTracking();

        if (examId.HasValue)
        {
            var questionIds = await _unitOfWork.ExamQuestions.Query()
                .Include(eq => eq.ExamCode)
                .Where(eq => eq.ExamCode.ExamId == examId.Value)
                .Select(eq => eq.QuestionId)
                .Distinct()
                .ToListAsync();

            query = query.Where(qs => questionIds.Contains(qs.QuestionId));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(qs => qs.WrongRate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<QuestionStatisticsDto>
        {
            Items      = _mapper.Map<List<QuestionStatisticsDto>>(items),
            TotalCount = total,
            Page       = page,
            PageSize   = pageSize
        };
    }

    public async Task<QuestionStatisticsDto> GetByQuestionAsync(Guid questionId)
    {
        var qs = await _unitOfWork.QuestionStatistics.Query()
            .Include(x => x.Question)
            .FirstOrDefaultAsync(x => x.QuestionId == questionId)
            ?? throw new KeyNotFoundException("Không tìm thấy thống kê câu hỏi.");

        return _mapper.Map<QuestionStatisticsDto>(qs);
    }

    public async Task<IEnumerable<QuestionStatisticsDto>> GetDifficultAsync()
    {
        var items = await _unitOfWork.QuestionStatistics.Query()
            .Include(qs => qs.Question)
            .Where(qs => qs.IsDifficult && !qs.Question.IsDeleted)
            .OrderByDescending(qs => qs.WrongRate)
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<List<QuestionStatisticsDto>>(items);
    }

    public async Task RecalculateForExamAsync(Guid examId)
    {
        var answers = await _unitOfWork.StudentAnswers.Query()
            .Include(sa => sa.ExamQuestion)
            .Where(sa => sa.ExamQuestion.ExamCode.ExamId == examId)
            .ToListAsync();

        var grouped = answers.GroupBy(sa => sa.ExamQuestion.QuestionId);

        foreach (var g in grouped)
        {
            var stats = await _unitOfWork.QuestionStatistics
                .FirstOrDefaultAsync(qs => qs.QuestionId == g.Key);

            if (stats is null) continue;

            stats.TotalAttempts = g.Count();
            stats.WrongCount    = g.Count(sa => !sa.IsCorrect);
            stats.WrongRate     = stats.TotalAttempts > 0
                ? (decimal)stats.WrongCount / stats.TotalAttempts : 0;
            stats.IsDifficult   = stats.WrongRate >= 0.4m;
            stats.LastUpdated   = DateTime.UtcNow;
            _unitOfWork.QuestionStatistics.Update(stats);
        }

        await _unitOfWork.SaveChangesAsync();
    }
}
