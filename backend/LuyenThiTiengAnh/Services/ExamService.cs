using AutoMapper;
using LuyenThiTiengAnh.DTOs.ExamMatrix;
using LuyenThiTiengAnh.DTOs.Exams;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Implementations;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

// ── ExamMatrixService ─────────────────────────────────────────────
public class ExamMatrixService : IExamMatrixService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ExamMatrixService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ExamMatrixDto>> GetAllAsync()
    {
        var matrices = await _unitOfWork.ExamMatrices.Query()
            .Include(m => m.SkillDistributions)
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<List<ExamMatrixDto>>(matrices);
    }

    public async Task<ExamMatrixDto> GetByIdAsync(Guid matrixId)
    {
        var matrix = await _unitOfWork.ExamMatrices.Query()
            .Include(m => m.SkillDistributions)
            .FirstOrDefaultAsync(m => m.MatrixId == matrixId)
            ?? throw new KeyNotFoundException("Không tìm thấy ma trận đề thi.");

        return _mapper.Map<ExamMatrixDto>(matrix);
    }

    public async Task<ExamMatrixDto> CreateAsync(CreateMatrixRequest request)
    {
        ValidateRates(request.RecognitionRate, request.UnderstandingRate,
                      request.ApplicationRate, request.HighAppRate);

        var matrix = new ExamMatrix
        {
            Name = request.Name,
            RecognitionRate = request.RecognitionRate,
            UnderstandingRate = request.UnderstandingRate,
            ApplicationRate = request.ApplicationRate,
            HighAppRate = request.HighAppRate
        };
        await _unitOfWork.ExamMatrices.AddAsync(matrix);

        foreach (var sd in request.SkillDistributions)
        {
            if (!Enum.TryParse<SkillType>(sd.Skill, true, out var skill))
                throw new ArgumentException($"Skill không hợp lệ: {sd.Skill}");

            await _unitOfWork.SkillDistributions.AddAsync(new SkillDistribution
            {
                MatrixId = matrix.MatrixId,
                Skill = skill,
                QuestionCount = sd.QuestionCount
            });
        }

        await _unitOfWork.SaveChangesAsync();
        return await GetByIdAsync(matrix.MatrixId);
    }

    public async Task<ExamMatrixDto> UpdateAsync(Guid matrixId, UpdateMatrixRequest request)
    {
        var matrix = await _unitOfWork.ExamMatrices.Query()
            .Include(m => m.SkillDistributions)
            .FirstOrDefaultAsync(m => m.MatrixId == matrixId)
            ?? throw new KeyNotFoundException("Không tìm thấy ma trận đề thi.");

        if (request.Name              is not null) matrix.Name              = request.Name;
        if (request.RecognitionRate   is not null) matrix.RecognitionRate   = request.RecognitionRate.Value;
        if (request.UnderstandingRate is not null) matrix.UnderstandingRate = request.UnderstandingRate.Value;
        if (request.ApplicationRate   is not null) matrix.ApplicationRate   = request.ApplicationRate.Value;
        if (request.HighAppRate       is not null) matrix.HighAppRate       = request.HighAppRate.Value;

        ValidateRates(matrix.RecognitionRate, matrix.UnderstandingRate,
                      matrix.ApplicationRate, matrix.HighAppRate);

        _unitOfWork.ExamMatrices.Update(matrix);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<ExamMatrixDto>(matrix);
    }

    public async Task DeleteAsync(Guid matrixId)
    {
        var matrix = await _unitOfWork.ExamMatrices.GetByIdAsync(matrixId)
            ?? throw new KeyNotFoundException("Không tìm thấy ma trận đề thi.");

        if (await _unitOfWork.Exams.AnyAsync(e => e.MatrixId == matrixId))
            throw new InvalidOperationException("Không thể xóa ma trận đang được sử dụng bởi đề thi.");

        _unitOfWork.ExamMatrices.Remove(matrix);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<SkillDistributionDto>> GetSkillDistributionsAsync(Guid matrixId)
    {
        var dists = await _unitOfWork.SkillDistributions.FindAsync(sd => sd.MatrixId == matrixId);
        return _mapper.Map<List<SkillDistributionDto>>(dists);
    }

    public async Task<IEnumerable<SkillDistributionDto>> UpdateSkillDistributionsAsync(
        Guid matrixId, UpdateSkillDistributionsRequest request)
    {
        var existing = await _unitOfWork.SkillDistributions.FindAsync(sd => sd.MatrixId == matrixId);
        _unitOfWork.SkillDistributions.RemoveRange(existing);

        foreach (var sd in request.SkillDistributions)
        {
            if (!Enum.TryParse<SkillType>(sd.Skill, true, out var skill))
                throw new ArgumentException($"Skill không hợp lệ: {sd.Skill}");

            await _unitOfWork.SkillDistributions.AddAsync(new SkillDistribution
            {
                MatrixId      = matrixId,
                Skill         = skill,
                QuestionCount = sd.QuestionCount
            });
        }

        await _unitOfWork.SaveChangesAsync();
        return await GetSkillDistributionsAsync(matrixId);
    }

    public async Task<ValidateMatrixResponse> ValidateAsync(Guid matrixId)
    {
        var matrix = await _unitOfWork.ExamMatrices.Query()
            .Include(m => m.SkillDistributions)
            .FirstOrDefaultAsync(m => m.MatrixId == matrixId);

        if (matrix is null)
            return new ValidateMatrixResponse { IsValid = false, Errors = new List<string> { "Không tìm thấy ma trận." } };

        var errors  = new List<string>();
        var total   = matrix.RecognitionRate + matrix.UnderstandingRate
                    + matrix.ApplicationRate + matrix.HighAppRate;

        if (total != 100)
            errors.Add($"Tổng tỷ lệ nhận thức phải bằng 100%, hiện tại: {total}%");

        if (!matrix.SkillDistributions.Any())
            errors.Add("Ma trận chưa có phân bổ kỹ năng.");

        foreach (var sd in matrix.SkillDistributions)
        {
            var available = await _unitOfWork.Questions.CountAsync(q => q.Skill == sd.Skill);
            if (available < sd.QuestionCount)
                errors.Add($"Kỹ năng {sd.Skill}: cần {sd.QuestionCount} câu nhưng ngân hàng chỉ có {available}.");
        }

        return new ValidateMatrixResponse
        {
            IsValid        = !errors.Any(),
            Errors         = errors,
            TotalQuestions = matrix.SkillDistributions.Sum(s => s.QuestionCount),
            TotalRate      = total
        };
    }

    private static void ValidateRates(decimal r1, decimal r2, decimal r3, decimal r4)
    {
        if (r1 + r2 + r3 + r4 != 100)
            throw new ArgumentException("Tổng các tỷ lệ nhận thức phải bằng 100%.");
    }
}

// ── ExamService ───────────────────────────────────────────────────
public class ExamService : IExamService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ExamService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<ExamListDto>> GetExamsAsync(string? status, int page, int pageSize)
    {
        var query = _unitOfWork.Exams.Query()
            .Include(e => e.Creator)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<ExamStatus>(status, true, out var examStatus))
            query = query.Where(e => e.Status == examStatus);

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<ExamListDto>
        {
            Items = _mapper.Map<List<ExamListDto>>(items),
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<ExamDto> GetByIdAsync(Guid examId)
    {
        var exam = await _unitOfWork.Exams.Query()
            .Include(e => e.Creator)
            .Include(e => e.Matrix)
            .Include(e => e.ExamCodes)
                .ThenInclude(ec => ec.ExamAttempts)
            .FirstOrDefaultAsync(e => e.ExamId == examId)
            ?? throw new KeyNotFoundException("Không tìm thấy kỳ thi.");

        var dto = _mapper.Map<ExamDto>(exam);
        dto.ParticipantCount = exam.ExamCodes
            .SelectMany(ec => ec.ExamAttempts)
            .Select(a => a.StudentId)
            .Distinct()
            .Count();

        return dto;
    }

    public async Task<ExamDto> CreateAsync(Guid teacherId, CreateExamRequest request)
    {
        var matrixExists = await _unitOfWork.ExamMatrices.AnyAsync(m => m.MatrixId == request.MatrixId);
        if (!matrixExists)
            throw new KeyNotFoundException("Không tìm thấy ma trận đề thi.");

        if (request.OpenTime.HasValue && request.CloseTime.HasValue
            && request.CloseTime <= request.OpenTime)
            throw new ArgumentException("Thời gian đóng phải sau thời gian mở.");

        var exam = new Exam
        {
            Title           = request.Title,
            DurationMinutes = request.DurationMinutes,
            TotalCodes      = request.TotalCodes,
            OpenTime        = request.OpenTime,
            CloseTime       = request.CloseTime,
            MatrixId        = request.MatrixId,
            CreatedBy       = teacherId
        };

        await _unitOfWork.Exams.AddAsync(exam);
        await _unitOfWork.SaveChangesAsync();
        return await GetByIdAsync(exam.ExamId);
    }

    public async Task<ExamDto> UpdateAsync(Guid examId, UpdateExamRequest request)
    {
        var exam = await _unitOfWork.Exams.GetByIdAsync(examId)
            ?? throw new KeyNotFoundException("Không tìm thấy kỳ thi.");

        if (exam.Status == ExamStatus.Active)
            throw new InvalidOperationException("Không thể chỉnh sửa đề thi đang Active.");

        if (request.Title           is not null) exam.Title           = request.Title;
        if (request.DurationMinutes is not null) exam.DurationMinutes = request.DurationMinutes.Value;
        if (request.TotalCodes      is not null) exam.TotalCodes      = request.TotalCodes.Value;
        if (request.OpenTime.HasValue)           exam.OpenTime        = request.OpenTime;
        if (request.CloseTime.HasValue)          exam.CloseTime       = request.CloseTime;
        if (request.MatrixId.HasValue)           exam.MatrixId        = request.MatrixId.Value;

        _unitOfWork.Exams.Update(exam);
        await _unitOfWork.SaveChangesAsync();
        return await GetByIdAsync(examId);
    }

    public async Task DeleteAsync(Guid examId)
    {
        var exam = await _unitOfWork.Exams.GetByIdAsync(examId)
            ?? throw new KeyNotFoundException("Không tìm thấy kỳ thi.");

        if (exam.Status == ExamStatus.Active)
            throw new InvalidOperationException("Không thể xóa đề thi đang Active.");

        _unitOfWork.Exams.Remove(exam);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ActivateAsync(Guid examId)
    {
        var exam = await _unitOfWork.Exams.Query()
            .Include(e => e.ExamCodes)
            .FirstOrDefaultAsync(e => e.ExamId == examId)
            ?? throw new KeyNotFoundException("Không tìm thấy kỳ thi.");

        if (!exam.ExamCodes.Any())
            throw new InvalidOperationException("Đề thi chưa có mã đề. Hãy sinh mã đề trước.");

        exam.Status = ExamStatus.Active;
        _unitOfWork.Exams.Update(exam);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeactivateAsync(Guid examId)
    {
        var exam = await _unitOfWork.Exams.GetByIdAsync(examId)
            ?? throw new KeyNotFoundException("Không tìm thấy kỳ thi.");

        exam.Status = ExamStatus.Closed;
        _unitOfWork.Exams.Update(exam);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<ScoreDistributionDto>> GetScoreDistributionAsync(Guid examId)
    {
        var results = await _unitOfWork.ExamResults.Query()
            .Include(r => r.Attempt).ThenInclude(a => a.ExamCode)
            .Where(r => r.Attempt.ExamCode.ExamId == examId)
            .Select(r => r.Score)
            .ToListAsync();

        if (!results.Any()) return new List<ScoreDistributionDto>();

        var bands = new[]
        {
            ("Dưới 2",   0m,   2m),
            ("2 – 3.9",  2m,   4m),
            ("4 – 4.9",  4m,   5m),
            ("5 – 6.4",  5m,   6.5m),
            ("6.5 – 7.9",6.5m, 8m),
            ("8 – 10",   8m,   10.01m)
        };

        return bands.Select(b => new ScoreDistributionDto
        {
            ScoreBand    = b.Item1,
            StudentCount = results.Count(s => s >= b.Item2 && s < b.Item3),
            Percentage   = results.Count > 0
                ? Math.Round(results.Count(s => s >= b.Item2 && s < b.Item3) * 100m / results.Count, 1)
                : 0
        }).ToList();
    }
}
