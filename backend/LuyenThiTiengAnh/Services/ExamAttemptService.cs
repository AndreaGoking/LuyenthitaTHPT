using AutoMapper;
using LuyenThiTiengAnh.DTOs.ExamAttempts;
using LuyenThiTiengAnh.DTOs.ExamResults;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class ExamAttemptService : IExamAttemptService
{
	private readonly IUnitOfWork _unitOfWork;
	private readonly IMapper _mapper;

	public ExamAttemptService(IUnitOfWork unitOfWork, IMapper mapper)
	{
		_unitOfWork = unitOfWork;
		_mapper = mapper;
	}

	public async Task<AttemptDto> StartAttemptAsync(Guid studentId, StartAttemptRequest request)
	{
		var code = await _unitOfWork.ExamCodes.Query()
			.Include(ec => ec.Exam)
			.Include(ec => ec.ExamQuestions.OrderBy(eq => eq.DisplayOrder))
				.ThenInclude(eq => eq.Question).ThenInclude(q => q.Passage)
			.FirstOrDefaultAsync(ec => ec.ExamCodeId == request.ExamCodeId)
			?? throw new KeyNotFoundException("Không tìm thấy mã đề.");

		if (code.Exam.Status != ExamStatus.Active)
			throw new InvalidOperationException("Kỳ thi chưa mở hoặc đã đóng.");

		var now = DateTime.UtcNow;
		if (code.Exam.OpenTime.HasValue && now < code.Exam.OpenTime.Value)
			throw new InvalidOperationException("Kỳ thi chưa đến thời gian làm bài.");
		if (code.Exam.CloseTime.HasValue && now > code.Exam.CloseTime.Value)
			throw new InvalidOperationException("Kỳ thi đã kết thúc.");

		var existing = await _unitOfWork.ExamAttempts.Query()
			.Include(a => a.ExamCode)
			.FirstOrDefaultAsync(a => a.StudentId == studentId
								   && a.ExamCode.ExamId == code.ExamId
								   && !a.IsSubmitted);
		if (existing is not null)
			return await BuildAttemptDto(existing, code);

		var attempt = new ExamAttempt
		{
			StudentId = studentId,
			ExamCodeId = request.ExamCodeId,
			StartTime = now
		};
		await _unitOfWork.ExamAttempts.AddAsync(attempt);

		foreach (var eq in code.ExamQuestions)
		{
			await _unitOfWork.StudentAnswers.AddAsync(new StudentAnswer
			{
				AttemptId = attempt.AttemptId,
				ExamQuestionId = eq.ExamQuestionId,
				AnsweredAt = now
			});
		}

		await _unitOfWork.SaveChangesAsync();
		return await BuildAttemptDto(attempt, code);
	}

	public async Task<AttemptDto> GetAttemptAsync(Guid attemptId, Guid studentId)
	{
		var attempt = await LoadAttemptAsync(attemptId, studentId);
		var code = await LoadCodeWithQuestionsAsync(attempt.ExamCodeId);
		return await BuildAttemptDto(attempt, code);
	}

	public async Task SaveAnswersAsync(Guid attemptId, Guid studentId, SaveAnswersBatchRequest request)
	{
		var attempt = await LoadAttemptAsync(attemptId, studentId);

		if (attempt.IsSubmitted)
			throw new InvalidOperationException("Bài thi đã được nộp.");

		foreach (var ans in request.Answers)
		{
			var existing = await _unitOfWork.StudentAnswers.FirstOrDefaultAsync(
				sa => sa.AttemptId == attemptId && sa.ExamQuestionId == ans.ExamQuestionId);

			if (existing is null) continue;

			existing.SelectedOption = ans.SelectedOption;
			existing.AnsweredAt = DateTime.UtcNow;
			_unitOfWork.StudentAnswers.Update(existing);
		}

		await _unitOfWork.SaveChangesAsync();
	}

	public async Task<ExamResultDto> SubmitAsync(Guid attemptId, Guid studentId, bool isAuto = false)
	{
		var attempt = await _unitOfWork.ExamAttempts.Query()
			.Include(a => a.StudentAnswers)
				.ThenInclude(sa => sa.ExamQuestion)
					.ThenInclude(eq => eq.Question)
			.Include(a => a.ExamCode).ThenInclude(ec => ec.Exam)
			.FirstOrDefaultAsync(a => a.AttemptId == attemptId)
			?? throw new KeyNotFoundException("Không tìm thấy lần thi.");

		if (attempt.StudentId != studentId)
			throw new UnauthorizedAccessException("Không có quyền nộp bài này.");

		if (attempt.IsSubmitted)
			throw new InvalidOperationException("Bài đã được nộp.");

		var now = DateTime.UtcNow;
		attempt.IsSubmitted = true;
		attempt.IsAutoSubmitted = isAuto;
		attempt.SubmitTime = now;
		_unitOfWork.ExamAttempts.Update(attempt);

		int correct = 0, wrong = 0;
		foreach (var sa in attempt.StudentAnswers)
		{
			if (sa.SelectedOption != null)
			{
				sa.IsCorrect = sa.SelectedOption == sa.ExamQuestion.Question.CorrectAnswer;
				if (sa.IsCorrect) correct++;
				else wrong++;
			}
			else
			{
				sa.IsCorrect = false;
				wrong++;
			}
			_unitOfWork.StudentAnswers.Update(sa);
		}

		int total = attempt.StudentAnswers.Count;
		var score = total > 0 ? Math.Round((decimal)correct / total * 10, 2) : 0m;

		var result = new ExamResult
		{
			AttemptId = attemptId,
			Score = score,
			CorrectCount = correct,
			WrongCount = wrong,
			TotalQuestions = total
		};
		await _unitOfWork.ExamResults.AddAsync(result);
		await _unitOfWork.SaveChangesAsync();

		_ = Task.Run(async () =>
		{
			foreach (var sa in attempt.StudentAnswers)
			{
				var stats = await _unitOfWork.QuestionStatistics
					.FirstOrDefaultAsync(qs => qs.QuestionId == sa.ExamQuestion.QuestionId);
				if (stats is null) continue;

				stats.TotalAttempts++;
				if (!sa.IsCorrect) stats.WrongCount++;
				stats.WrongRate = stats.TotalAttempts > 0
					? (decimal)stats.WrongCount / stats.TotalAttempts
					: 0;
				stats.IsDifficult = stats.WrongRate >= 0.4m;
				stats.LastUpdated = DateTime.UtcNow;
				_unitOfWork.QuestionStatistics.Update(stats);
			}
			await _unitOfWork.SaveChangesAsync();
		});

		return new ExamResultDto
		{
			ResultId = result.ResultId,
			AttemptId = attemptId,
			ExamTitle = attempt.ExamCode.Exam.Title,
			CodeNumber = attempt.ExamCode.CodeNumber,
			Score = score,
			CorrectCount = correct,
			WrongCount = wrong,
			TotalQuestions = total,
			CorrectPercent = total > 0 ? Math.Round((decimal)correct / total * 100, 1) : 0,
			IsAutoSubmitted = isAuto,
			SubmitTime = now
		};
	}

	public async Task<int> GetRemainingSecondsAsync(Guid attemptId)
	{
		var attempt = await _unitOfWork.ExamAttempts.Query()
			.Include(a => a.ExamCode).ThenInclude(ec => ec.Exam)
			.FirstOrDefaultAsync(a => a.AttemptId == attemptId)
			?? throw new KeyNotFoundException("Không tìm thấy lần thi.");

		var elapsed = (int)(DateTime.UtcNow - attempt.StartTime).TotalSeconds;
		var total = attempt.ExamCode.Exam.DurationMinutes * 60;
		return Math.Max(0, total - elapsed);
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

	// ── Private helpers ──────────────────────────────────────────
	private async Task<ExamAttempt> LoadAttemptAsync(Guid attemptId, Guid studentId)
	{
		var attempt = await _unitOfWork.ExamAttempts.GetByIdAsync(attemptId)
			?? throw new KeyNotFoundException("Không tìm thấy lần thi.");

		if (attempt.StudentId != studentId)
			throw new UnauthorizedAccessException("Không có quyền truy cập bài thi này.");

		return attempt;
	}

	private async Task<ExamCode> LoadCodeWithQuestionsAsync(Guid codeId)
	{
		return await _unitOfWork.ExamCodes.Query()
			.Include(ec => ec.Exam)
			.Include(ec => ec.ExamQuestions.OrderBy(eq => eq.DisplayOrder))
				.ThenInclude(eq => eq.Question)
			.FirstOrDefaultAsync(ec => ec.ExamCodeId == codeId)
			?? throw new KeyNotFoundException("Không tìm thấy mã đề.");
	}

	private async Task<AttemptDto> BuildAttemptDto(ExamAttempt attempt, ExamCode code)
	{
		var answers = await _unitOfWork.StudentAnswers.Query()
			.Where(sa => sa.AttemptId == attempt.AttemptId)
			.ToDictionaryAsync(sa => sa.ExamQuestionId, sa => sa.SelectedOption);

		var elapsed = (int)(DateTime.UtcNow - attempt.StartTime).TotalSeconds;
		var total = code.Exam.DurationMinutes * 60;

		return new AttemptDto
		{
			AttemptId = attempt.AttemptId,
			ExamCodeId = code.ExamCodeId,
			CodeNumber = code.CodeNumber,
			ExamTitle = code.Exam.Title,
			DurationMinutes = code.Exam.DurationMinutes,
			StartTime = attempt.StartTime,
			IsSubmitted = attempt.IsSubmitted,
			RemainingSeconds = Math.Max(0, total - elapsed),
			Questions = code.ExamQuestions.Select(eq => new AttemptQuestionDto
			{
				ExamQuestionId = eq.ExamQuestionId,
				DisplayOrder = eq.DisplayOrder,
				Content = eq.Question.Content,
				OptionA = eq.Question.OptionA,
				OptionB = eq.Question.OptionB,
				OptionC = eq.Question.OptionC,
				OptionD = eq.Question.OptionD,
				PassageId = eq.Question.PassageId,
				SelectedOption = answers.GetValueOrDefault(eq.ExamQuestionId)
			}).ToList()
		};
	}
}