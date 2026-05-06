using LuyenThiTiengAnh.DTOs.ExamAttempts;
using LuyenThiTiengAnh.DTOs.ExamResults;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuyenThiTiengAnh.Controllers;

// ── ExamAttemptController ─────────────────────────────────────────
[Route("api/exam-attempts")]
[Authorize]
public class ExamAttemptController : BaseController
{
	private readonly IExamAttemptService _examAttempService;
	public ExamAttemptController(IExamAttemptService examAttempService)
	{
		_examAttempService = examAttempService;
	}

	/// <summary>POST /api/exam-attempts — bắt đầu làm bài</summary>
	[HttpPost]
	[Authorize(Roles = "Student")]
	public async Task<IActionResult> Start([FromBody] StartAttemptRequest request)
	{
		var result = await _examAttempService.StartAttemptAsync(CurrentUserId, request);
		return Ok(ApiResponse<AttemptDto>.Ok(result, "Bắt đầu làm bài."));
	}

	/// <summary>GET /api/exam-attempts/{id}</summary>
	[HttpGet("{id:guid}")]
	[Authorize(Roles = "Student")]
	public async Task<IActionResult> GetAttempt(Guid id)
	{
		var result = await _examAttempService.GetAttemptAsync(id, CurrentUserId);
		return Ok(ApiResponse<AttemptDto>.Ok(result));
	}

	/// <summary>PATCH /api/exam-attempts/{id}/answers — lưu đáp án tạm</summary>
	[HttpPatch("{id:guid}/answers")]
	[Authorize(Roles = "Student")]
	public async Task<IActionResult> SaveAnswers(Guid id, [FromBody] SaveAnswersBatchRequest request)
	{
		await _examAttempService.SaveAnswersAsync(id, CurrentUserId, request);
		return Ok(ApiResponse.Ok("Lưu đáp án thành công."));
	}

	/// <summary>POST /api/exam-attempts/{id}/submit — nộp bài thủ công</summary>
	[HttpPost("{id:guid}/submit")]
	[Authorize(Roles = "Student")]
	public async Task<IActionResult> Submit(Guid id)
	{
		var result = await _examAttempService.SubmitAsync(id, CurrentUserId, isAuto: false);
		return Ok(ApiResponse<ExamResultDto>.Ok(result, "Nộp bài thành công."));
	}

	/// <summary>POST /api/exam-attempts/{id}/auto-submit — nộp bài tự động hết giờ</summary>
	[HttpPost("{id:guid}/auto-submit")]
	[Authorize(Roles = "Student")]
	public async Task<IActionResult> AutoSubmit(Guid id)
	{
		var result = await _examAttempService.SubmitAsync(id, CurrentUserId, isAuto: true);
		return Ok(ApiResponse<ExamResultDto>.Ok(result, "Hết thời gian — bài đã được nộp tự động."));
	}

	/// <summary>GET /api/exam-attempts/{id}/remaining-time</summary>
	[HttpGet("{id:guid}/remaining-time")]
	[Authorize(Roles = "Student")]
	public async Task<IActionResult> RemainingTime(Guid id)
	{
		var seconds = await _examAttempService.GetRemainingSecondsAsync(id);
		return Ok(ApiResponse<object>.Ok(new { remainingSeconds = seconds }));
	}

	/// <summary>GET /api/exam-attempts?page=1&amp;pageSize=10 — lịch sử làm bài</summary>
	[HttpGet]
	[Authorize(Roles = "Student")]
	public async Task<IActionResult> GetHistory(
		[FromQuery] int page = 1, [FromQuery] int pageSize = 10)
	{
		var result = await _examAttempService.GetHistoryAsync(CurrentUserId, page, pageSize);
		return Ok(ApiResponse<PagedResult<AttemptHistoryDto>>.Ok(result));
	}
}

// ── ExamResultController ──────────────────────────────────────────
[Route("api/exam-results")]
[Authorize]
public class ExamResultController : BaseController
{
	private readonly IExamResultService _examResultService;
	public ExamResultController(IExamResultService examResultService) => _examResultService = examResultService;

	/// <summary>GET /api/exam-results/{attemptId}</summary>
	[HttpGet("{attemptId:guid}")]
	public async Task<IActionResult> GetResult(Guid attemptId)
	{
		var result = await _examResultService.GetResultAsync(attemptId, CurrentUserId);
		return Ok(ApiResponse<ExamResultDto>.Ok(result));
	}

	/// <summary>GET /api/exam-results/{attemptId}/detail</summary>
	[HttpGet("{attemptId:guid}/detail")]
	public async Task<IActionResult> GetDetail(Guid attemptId)
	{
		var result = await _examResultService.GetDetailAsync(attemptId, CurrentUserId);
		return Ok(ApiResponse<ResultDetailDto>.Ok(result));
	}

	/// <summary>GET /api/exam-results/{attemptId}/skill-breakdown</summary>
	[HttpGet("{attemptId:guid}/skill-breakdown")]
	public async Task<IActionResult> SkillBreakdown(Guid attemptId)
	{
		var result = await _examResultService.GetSkillBreakdownAsync(attemptId, CurrentUserId);
		return Ok(ApiResponse<List<SkillBreakdownDto>>.Ok(result));
	}

	/// <summary>GET /api/exam-results/{attemptId}/weak-topics</summary>
	[HttpGet("{attemptId:guid}/weak-topics")]
	public async Task<IActionResult> WeakTopics(Guid attemptId)
	{
		var result = await _examResultService.GetWeakTopicsAsync(attemptId, CurrentUserId);
		return Ok(ApiResponse<List<WeakTopicDto>>.Ok(result));
	}
}