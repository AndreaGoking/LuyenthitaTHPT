using AutoMapper;
using LuyenThiTiengAnh.DTOs.ExamCodes;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class ExamCodeService : IExamCodeService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ExamCodeService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ExamCodeDto>> GetByExamAsync(Guid examId)
    {
        var codes = await _unitOfWork.ExamCodes.Query()
            .Include(ec => ec.ExamQuestions)
            .Where(ec => ec.ExamId == examId)
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<List<ExamCodeDto>>(codes);
    }

    public async Task<ExamCodeDetailDto> GetDetailAsync(Guid examId, Guid codeId)
    {
        var code = await _unitOfWork.ExamCodes.Query()
            .Include(ec => ec.ExamQuestions.OrderBy(eq => eq.DisplayOrder))
                .ThenInclude(eq => eq.Question)
            .FirstOrDefaultAsync(ec => ec.ExamCodeId == codeId && ec.ExamId == examId)
            ?? throw new KeyNotFoundException("Không tìm thấy mã đề.");

        var dto = _mapper.Map<ExamCodeDto>(code);
        return new ExamCodeDetailDto
        {
            ExamCodeId = dto.ExamCodeId,
            CodeNumber = dto.CodeNumber,
            Version = dto.Version,
            QuestionCount = dto.QuestionCount,
            Questions = _mapper.Map<List<ExamQuestionDto>>(code.ExamQuestions)
        };
    }

    public async Task<IEnumerable<ExamCodeDto>> GenerateCodesAsync(Guid examId, int count)
    {
        var exam = await _unitOfWork.Exams.Query()
            .Include(e => e.Matrix)
                .ThenInclude(m => m.SkillDistributions)
            .Include(e => e.ExamCodes)
            .FirstOrDefaultAsync(e => e.ExamId == examId)
            ?? throw new KeyNotFoundException("Không tìm thấy kỳ thi.");

        var questionPool = new List<Question>();
        foreach (var sd in exam.Matrix.SkillDistributions)
        {
            var questions = await _unitOfWork.Questions.Query()
                .Where(q => q.Skill == sd.Skill)
                .AsNoTracking()
                .ToListAsync();

            if (questions.Count < sd.QuestionCount)
                throw new InvalidOperationException(
                    $"Kỹ năng {sd.Skill}: cần {sd.QuestionCount} câu nhưng ngân hàng chỉ có {questions.Count}.");

            questionPool.AddRange(questions
                .OrderBy(_ => Guid.NewGuid())
                .Take(sd.QuestionCount));
        }

        var startCode    = exam.ExamCodes.Count;
        var createdCodes = new List<ExamCode>();

        for (int i = 0; i < count; i++)
        {
            var codeNumber = (201 + startCode + i).ToString();
            var code = new ExamCode
            {
                ExamId     = examId,
                CodeNumber = codeNumber,
                Version    = 1
            };
            await _unitOfWork.ExamCodes.AddAsync(code);

            var shuffled = questionPool.OrderBy(_ => Guid.NewGuid()).ToList();
            for (int order = 0; order < shuffled.Count; order++)
            {
                await _unitOfWork.ExamQuestions.AddAsync(new ExamQuestion
                {
                    ExamCodeId   = code.ExamCodeId,
                    QuestionId   = shuffled[order].QuestionId,
                    DisplayOrder = order + 1
                });
            }
            createdCodes.Add(code);
        }

        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<List<ExamCodeDto>>(createdCodes);
    }

	public async Task<ExamCodeDto> ShuffleAsync(Guid examId, Guid codeId)
	{
		var code = await _unitOfWork.ExamCodes.Query()
			.Include(ec => ec.ExamQuestions)
			.FirstOrDefaultAsync(ec => ec.ExamCodeId == codeId && ec.ExamId == examId)
			?? throw new KeyNotFoundException("Không tìm thấy mã đề.");

		var examQuestions = code.ExamQuestions.ToList();
		if (examQuestions.Count == 0)
			return _mapper.Map<ExamCodeDto>(code);

		// Xáo trộn ngẫu nhiên
		var shuffled = examQuestions.OrderBy(_ => Guid.NewGuid()).ToList();

		// Bước 1: Đặt DisplayOrder tạm thời thành giá trị âm
		for (int i = 0; i < shuffled.Count; i++)
		{
			shuffled[i].DisplayOrder = -i - 1;
			_unitOfWork.ExamQuestions.Update(shuffled[i]);
		}
		await _unitOfWork.SaveChangesAsync();

		// Bước 2: Gán lại DisplayOrder đúng
		for (int i = 0; i < shuffled.Count; i++)
		{
			shuffled[i].DisplayOrder = i + 1;
			_unitOfWork.ExamQuestions.Update(shuffled[i]);
		}

		code.Version++;
		_unitOfWork.ExamCodes.Update(code);
		await _unitOfWork.SaveChangesAsync();

		// Load lại dữ liệu để trả về DTO
		var updatedCode = await _unitOfWork.ExamCodes.Query()
			.Include(ec => ec.ExamQuestions)
			.FirstOrDefaultAsync(ec => ec.ExamCodeId == codeId);
		return _mapper.Map<ExamCodeDto>(updatedCode);
	}

	public async Task DeleteAsync(Guid examId, Guid codeId)
    {
        var code = await _unitOfWork.ExamCodes.FirstOrDefaultAsync(
            ec => ec.ExamCodeId == codeId && ec.ExamId == examId)
            ?? throw new KeyNotFoundException("Không tìm thấy mã đề.");

        var hasAttempts = await _unitOfWork.ExamAttempts.AnyAsync(a => a.ExamCodeId == codeId);
        if (hasAttempts)
            throw new InvalidOperationException("Không thể xóa mã đề đã có học sinh làm bài.");

        _unitOfWork.ExamCodes.Remove(code);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<byte[]> ExportToWordAsync(Guid examId, Guid codeId)
    {
        // TODO: implement with DocumentFormat.OpenXml
        await Task.CompletedTask;
        return Array.Empty<byte>();
    }

    public async Task<byte[]> ExportToPdfAsync(Guid examId, Guid codeId)
    {
        // TODO: implement with QuestPDF or PdfSharpCore
        await Task.CompletedTask;
        return Array.Empty<byte>();
    }
}
