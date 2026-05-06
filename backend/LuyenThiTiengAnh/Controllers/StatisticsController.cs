using LuyenThiTiengAnh.DTOs.ExamAttempts;
using LuyenThiTiengAnh.DTOs.ExamResults;
using LuyenThiTiengAnh.DTOs.Exams;
using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.StudyMaterials;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuyenThiTiengAnh.Controllers;

// ── StatisticsController (Admin) ─────────────────────────────────
[Route("api/statistics")]
[Authorize(Roles = "Admin")]
public class StatisticsController : BaseController
{
	private readonly IStatisticsService _statisticsService;
	public StatisticsController(IStatisticsService statisticsService)
	{
		_statisticsService = statisticsService;
	}

	[HttpGet("overview")]
	public async Task<IActionResult> Overview()
	{
		var result = await _statisticsService.GetOverviewAsync();
		return Ok(ApiResponse<SystemOverviewDto>.Ok(result));
	}

	[HttpGet("exams/{examId:guid}/participants")]
	public async Task<IActionResult> Participants(
		Guid examId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
	{
		var result = await _statisticsService.GetParticipantsAsync(examId, page, pageSize);
		return Ok(ApiResponse<PagedResult<ExamParticipantDto>>.Ok(result));
	}

	[HttpGet("exams/{examId:guid}/submission-status")]
	public async Task<IActionResult> SubmissionStatus(Guid examId)
	{
		var result = await _statisticsService.GetSubmissionStatusAsync(examId);
		return Ok(ApiResponse<SubmissionStatusDto>.Ok(result));
	}

	[HttpGet("exams/{examId:guid}/score-chart")]
	public async Task<IActionResult> ScoreChart(Guid examId)
	{
		var result = await _statisticsService.GetScoreChartAsync(examId);
		return Ok(ApiResponse<List<ScoreDistributionDto>>.Ok(result));
	}

	[HttpGet("users/count")]
	public async Task<IActionResult> UserCount()
	{
		var result = await _statisticsService.GetUserCountAsync();
		return Ok(ApiResponse<UserCountDto>.Ok(result));
	}
}

// ── QuestionStatisticsController (Teacher/Admin) ──────────────────
[Route("api/question-statistics")]
[Authorize(Roles = "Admin,Teacher")]
public class QuestionStatisticsController : BaseController
{
	private readonly IQuestionStatisticsService _questionStatisticsService;
	public QuestionStatisticsController(IQuestionStatisticsService questionStatisticsService)
	{
		_questionStatisticsService = questionStatisticsService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll(
	[FromQuery] Guid? examId,
	[FromQuery] int page = 1,
	[FromQuery] int pageSize = 20)
	{
		var result = await _questionStatisticsService.GetAllAsync(examId, page, pageSize);
		return Ok(ApiResponse<PagedResult<QuestionStatisticsDto>>.Ok(result));
	}

	[HttpGet("{questionId:guid}")]
	public async Task<IActionResult> GetByQuestion(Guid questionId)
	{
		var result = await _questionStatisticsService.GetByQuestionAsync(questionId);
		return Ok(ApiResponse<QuestionStatisticsDto>.Ok(result));
	}

	[HttpGet("difficult")]
	public async Task<IActionResult> GetDifficult()
	{
		var result = await _questionStatisticsService.GetDifficultAsync();
		return Ok(ApiResponse<IEnumerable<QuestionStatisticsDto>>.Ok(result));
	}

	[HttpPost("recalculate/{examId:guid}")]
	[Authorize(Roles = "Admin")]
	public async Task<IActionResult> Recalculate(Guid examId)
	{
		await _questionStatisticsService.RecalculateForExamAsync(examId);
		return Ok(ApiResponse.Ok("Tính lại thống kê thành công."));
	}
}

// ── ProgressController (Student) ─────────────────────────────────
[Route("api/progress")]
[Authorize(Roles = "Student")]
public class ProgressController : BaseController
{
	private readonly IProgressService _progressService;
	public ProgressController(IProgressService progressService)
	{
		_progressService = progressService;
	}

	[HttpGet]
	public async Task<IActionResult> Overview()
	{
		var result = await _progressService.GetOverviewAsync(CurrentUserId);
		return Ok(ApiResponse<ProgressOverviewDto>.Ok(result));
	}

	[HttpGet("history")]
	public async Task<IActionResult> History(
		[FromQuery] int page = 1, [FromQuery] int pageSize = 10)
	{
		var result = await _progressService.GetHistoryAsync(CurrentUserId, page, pageSize);
		return Ok(ApiResponse<PagedResult<AttemptHistoryDto>>.Ok(result));
	}

	[HttpGet("skill-trend")]
	public async Task<IActionResult> SkillTrend()
	{
		var result = await _progressService.GetScoreTrendAsync(CurrentUserId);
		return Ok(ApiResponse<List<ScoreTrendDto>>.Ok(result));
	}

	[HttpGet("weak-topics")]
	public async Task<IActionResult> WeakTopics()
	{
		var result = await _progressService.GetWeakTopicsAsync(CurrentUserId);
		return Ok(ApiResponse<List<WeakTopicSummaryDto>>.Ok(result));
	}
}

// ── StudyMaterialController ───────────────────────────────────────
[Route("api/study-materials")]
[Authorize]
public class StudyMaterialController : BaseController
{
	private readonly IStudyMaterialService _studyMaterialService;
	public StudyMaterialController(IStudyMaterialService studyMaterialService)
	{
		_studyMaterialService = studyMaterialService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll([FromQuery] MaterialFilterRequest filter)
	{
		var result = await _studyMaterialService.GetAllAsync(filter);
		return Ok(ApiResponse<PagedResult<StudyMaterialListDto>>.Ok(result));
	}

	[HttpGet("{id:guid}")]
	public async Task<IActionResult> GetById(Guid id)
	{
		var result = await _studyMaterialService.GetByIdAsync(id);
		return Ok(ApiResponse<StudyMaterialDto>.Ok(result));
	}

	[HttpPost]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Create([FromBody] CreateMaterialRequest request)
	{
		var result = await _studyMaterialService.CreateAsync(CurrentUserId, request);
		return CreatedAtAction(nameof(GetById), new { id = result.MaterialId },
			ApiResponse<StudyMaterialDto>.Ok(result, "Tạo tài liệu thành công."));
	}

	[HttpPut("{id:guid}")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMaterialRequest request)
	{
		var result = await _studyMaterialService.UpdateAsync(id, CurrentUserId, request);
		return Ok(ApiResponse<StudyMaterialDto>.Ok(result, "Cập nhật tài liệu thành công."));
	}

	[HttpDelete("{id:guid}")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Delete(Guid id)
	{
		await _studyMaterialService.DeleteAsync(id, CurrentUserId);
		return Ok(ApiResponse.Ok("Xóa tài liệu thành công."));
	}
}