using AutoMapper;
using LuyenThiTiengAnh.DTOs.Questions;
using LuyenThiTiengAnh.DTOs.ReadingPassages;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class QuestionService : IQuestionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public QuestionService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<QuestionListDto>> GetQuestionsAsync(QuestionFilterRequest filter)
    {
        var query = _unitOfWork.Questions.Query()
            .Include(q => q.Creator)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.Skill) &&
            Enum.TryParse<SkillType>(filter.Skill, true, out var skill))
            query = query.Where(q => q.Skill == skill);

        if (!string.IsNullOrWhiteSpace(filter.Level) &&
            Enum.TryParse<CognitiveLevel>(filter.Level, true, out var level))
            query = query.Where(q => q.Level == level);

        if (!string.IsNullOrWhiteSpace(filter.Topic))
            query = query.Where(q => q.Topic.Contains(filter.Topic));

        if (!string.IsNullOrWhiteSpace(filter.Source))
            query = query.Where(q => q.Source != null && q.Source.Contains(filter.Source));

        if (filter.PassageId.HasValue)
            query = query.Where(q => q.PassageId == filter.PassageId.Value);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var s = filter.Search.ToLower();
            query = query.Where(q => q.Content.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResult<QuestionListDto>
        {
            Items      = _mapper.Map<List<QuestionListDto>>(items),
            TotalCount = total,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<QuestionDto> GetByIdAsync(Guid questionId)
    {
        var q = await _unitOfWork.Questions.Query()
            .Include(x => x.Creator)
            .FirstOrDefaultAsync(x => x.QuestionId == questionId)
            ?? throw new KeyNotFoundException("Không tìm thấy câu hỏi.");

        return _mapper.Map<QuestionDto>(q);
    }

    public async Task<QuestionDto> CreateAsync(Guid teacherId, CreateQuestionRequest request)
    {
        if (!Enum.TryParse<SkillType>(request.Skill, true, out var skill))
            throw new ArgumentException($"Skill không hợp lệ: {request.Skill}");

        if (!Enum.TryParse<CognitiveLevel>(request.Level, true, out var level))
            throw new ArgumentException($"Level không hợp lệ: {request.Level}");

        if (request.PassageId.HasValue)
        {
            var passage = await _unitOfWork.ReadingPassages.GetByIdAsync(request.PassageId.Value)
                ?? throw new KeyNotFoundException("Không tìm thấy bài đọc.");
        }

        var question = new Question
        {
            Content       = request.Content,
            OptionA       = request.OptionA,
            OptionB       = request.OptionB,
            OptionC       = request.OptionC,
            OptionD       = request.OptionD,
            CorrectAnswer = request.CorrectAnswer,
            Skill         = skill,
            Level         = level,
            Topic         = request.Topic,
            Source        = request.Source,
            PassageId     = request.PassageId,
            CreatedBy     = teacherId
        };

        await _unitOfWork.Questions.AddAsync(question);

        // Initialize statistics row
        await _unitOfWork.QuestionStatistics.AddAsync(new QuestionStatistics
        {
            QuestionId = question.QuestionId
        });

        await _unitOfWork.SaveChangesAsync();
        return await GetByIdAsync(question.QuestionId);
    }

    public async Task<QuestionDto> UpdateAsync(Guid questionId, Guid userId, UpdateQuestionRequest request)
    {
        var question = await _unitOfWork.Questions.Query()
            .Include(q => q.Creator)
            .FirstOrDefaultAsync(q => q.QuestionId == questionId)
            ?? throw new KeyNotFoundException("Không tìm thấy câu hỏi.");

        if (request.Content       is not null) question.Content       = request.Content;
        if (request.OptionA       is not null) question.OptionA       = request.OptionA;
        if (request.OptionB       is not null) question.OptionB       = request.OptionB;
        if (request.OptionC       is not null) question.OptionC       = request.OptionC;
        if (request.OptionD       is not null) question.OptionD       = request.OptionD;
        if (request.CorrectAnswer is not null) question.CorrectAnswer = request.CorrectAnswer;
        if (request.Topic         is not null) question.Topic         = request.Topic;
        if (request.Source        is not null) question.Source        = request.Source;
        if (request.PassageId.HasValue)        question.PassageId     = request.PassageId;

        if (request.Skill is not null && Enum.TryParse<SkillType>(request.Skill, true, out var skill))
            question.Skill = skill;

        if (request.Level is not null && Enum.TryParse<CognitiveLevel>(request.Level, true, out var level))
            question.Level = level;

        question.UpdatedBy = userId;
        question.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.Questions.Update(question);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<QuestionDto>(question);
    }

    public async Task DeleteAsync(Guid questionId, Guid userId)
    {
        var question = await _unitOfWork.Questions.GetByIdAsync(questionId)
            ?? throw new KeyNotFoundException("Không tìm thấy câu hỏi.");

        question.IsDeleted = true;
        question.DeletedBy = userId;
        question.DeletedAt = DateTime.UtcNow;

        _unitOfWork.Questions.Update(question);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<ImportQuestionsResponse> ImportFromWordAsync(
        Guid teacherId, Stream fileStream, string fileName)
    {
        // TODO: implement DOCX parsing with DocumentFormat.OpenXml
        // For now return placeholder
        await Task.CompletedTask;
        return new ImportQuestionsResponse
        {
            Imported = 0,
            Skipped  = 0,
            Errors   = new List<string> { "Tính năng import Word đang được phát triển." }
        };
    }
}

// ── ReadingPassageService ─────────────────────────────────────────
public class ReadingPassageService : IReadingPassageService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper     _mapper;

    public ReadingPassageService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<PassageDto>> GetAllAsync()
    {
        var passages = await _unitOfWork.ReadingPassages.Query()
            .Include(p => p.Creator)
            .Include(p => p.Questions)
            .AsNoTracking()
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<PassageDto>>(passages);
    }

    public async Task<PassageDetailDto> GetByIdAsync(Guid passageId)
    {
        var passage = await _unitOfWork.ReadingPassages.Query()
            .Include(p => p.Creator)
            .Include(p => p.Questions).ThenInclude(q => q.Creator)
            .FirstOrDefaultAsync(p => p.PassageId == passageId)
            ?? throw new KeyNotFoundException("Không tìm thấy bài đọc.");

        return _mapper.Map<PassageDetailDto>(passage);
    }

    public async Task<PassageDto> CreateAsync(Guid teacherId, CreatePassageRequest request)
    {
        var passage = new ReadingPassage
        {
            Title = request.Title,
            Content = request.Content,
            CreatedBy = teacherId
        };
        await _unitOfWork.ReadingPassages.AddAsync(passage);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(passage.PassageId)
               .ContinueWith(t => _mapper.Map<PassageDto>(t.Result));
    }

    public async Task<PassageDto> UpdateAsync(Guid passageId, UpdatePassageRequest request)
    {
        var passage = await _unitOfWork.ReadingPassages.Query()
            .Include(p => p.Creator)
            .Include(p => p.Questions)
            .FirstOrDefaultAsync(p => p.PassageId == passageId)
            ?? throw new KeyNotFoundException("Không tìm thấy bài đọc.");

        if (request.Title   is not null) passage.Title   = request.Title;
        if (request.Content is not null) passage.Content = request.Content;

        _unitOfWork.ReadingPassages.Update(passage);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<PassageDto>(passage);
    }

    public async Task DeleteAsync(Guid passageId)
    {
        var passage = await _unitOfWork.ReadingPassages.GetByIdAsync(passageId)
            ?? throw new KeyNotFoundException("Không tìm thấy bài đọc.");

        _unitOfWork.ReadingPassages.Remove(passage);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task AddQuestionAsync(Guid passageId, Guid questionId)
    {
        var passage = await _unitOfWork.ReadingPassages.GetByIdAsync(passageId)
            ?? throw new KeyNotFoundException("Không tìm thấy bài đọc.");

        var question = await _unitOfWork.Questions.GetByIdAsync(questionId)
            ?? throw new KeyNotFoundException("Không tìm thấy câu hỏi.");

        if (question.PassageId.HasValue)
            throw new InvalidOperationException("Câu hỏi đã thuộc một bài đọc khác.");

        question.PassageId = passageId;
        _unitOfWork.Questions.Update(question);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveQuestionAsync(Guid passageId, Guid questionId)
    {
        var question = await _unitOfWork.Questions.FirstOrDefaultAsync(
            q => q.QuestionId == questionId && q.PassageId == passageId)
            ?? throw new KeyNotFoundException("Không tìm thấy câu hỏi trong bài đọc này.");

        question.PassageId = null;
        _unitOfWork.Questions.Update(question);
        await _unitOfWork.SaveChangesAsync();
    }
}
