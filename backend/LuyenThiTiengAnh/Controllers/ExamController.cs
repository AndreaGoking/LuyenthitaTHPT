using LuyenThiTiengAnh.DTOs.ExamCodes;
using LuyenThiTiengAnh.DTOs.ExamMatrix;
using LuyenThiTiengAnh.DTOs.Exams;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuyenThiTiengAnh.Controllers;

// ── ExamMatrixController ──────────────────────────────────────────
[Route("api/exam-matrices")]
[Authorize(Roles = "Admin,Teacher")]
public class ExamMatrixController : BaseController
{
	private readonly IExamMatrixService _examMatrixService;
	public ExamMatrixController(IExamMatrixService examMatrixService)
	{
		_examMatrixService = examMatrixService;
	}

		[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var result = await _examMatrixService.GetAllAsync();
		return Ok(ApiResponse<IEnumerable<ExamMatrixDto>>.Ok(result));
	}

	[HttpGet("{id:guid}")]
	public async Task<IActionResult> GetById(Guid id)
	{
		var result = await _examMatrixService.GetByIdAsync(id);
		return Ok(ApiResponse<ExamMatrixDto>.Ok(result));
	}

	[HttpPost]
	public async Task<IActionResult> Create([FromBody] CreateMatrixRequest request)
	{
		var result = await _examMatrixService.CreateAsync(request);
		return CreatedAtAction(nameof(GetById), new { id = result.MatrixId },
			ApiResponse<ExamMatrixDto>.Ok(result, "Tạo ma trận đề thành công."));
	}

	[HttpPut("{id:guid}")]
	public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMatrixRequest request)
	{
		var result = await _examMatrixService.UpdateAsync(id, request);
		return Ok(ApiResponse<ExamMatrixDto>.Ok(result, "Cập nhật ma trận thành công."));
	}

	[HttpDelete("{id:guid}")]
	public async Task<IActionResult> Delete(Guid id)
	{
		await _examMatrixService.DeleteAsync(id);
		return Ok(ApiResponse.Ok("Xóa ma trận thành công."));
	}

	[HttpGet("{id:guid}/skill-distributions")]
	public async Task<IActionResult> GetSkillDistributions(Guid id)
	{
		var result = await _examMatrixService.GetSkillDistributionsAsync(id);
		return Ok(ApiResponse<IEnumerable<SkillDistributionDto>>.Ok(result));
	}

	[HttpPut("{id:guid}/skill-distributions")]
	public async Task<IActionResult> UpdateSkillDistributions(
		Guid id, [FromBody] UpdateSkillDistributionsRequest request)
	{
		var result = await _examMatrixService.UpdateSkillDistributionsAsync(id, request);
		return Ok(ApiResponse<IEnumerable<SkillDistributionDto>>.Ok(result, "Cập nhật phân bổ thành công."));
	}

	[HttpGet("{id:guid}/validate")]
	public async Task<IActionResult> Validate(Guid id)
	{
		var result = await _examMatrixService.ValidateAsync(id);
		return Ok(ApiResponse<ValidateMatrixResponse>.Ok(result));
	}
}

// ── ExamController ────────────────────────────────────────────────
[Route("api/exams")]
[Authorize]
public class ExamController : BaseController
{
	private readonly IExamService _examService;
	public ExamController(IExamService examService)
	{
		_examService = examService;
	}

	[HttpGet]
	public async Task<IActionResult> GetAll(
		[FromQuery] string? status,
		[FromQuery] int page = 1,
		[FromQuery] int pageSize = 20)
	{
		var result = await _examService.GetExamsAsync(status, page, pageSize);
		return Ok(ApiResponse<PagedResult<ExamListDto>>.Ok(result));
	}

	[HttpGet("{id:guid}")]
	public async Task<IActionResult> GetById(Guid id)
	{
		var result = await _examService.GetByIdAsync(id);
		return Ok(ApiResponse<ExamDto>.Ok(result));
	}

	[HttpPost]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Create([FromBody] CreateExamRequest request)
	{
		var result = await _examService.CreateAsync(CurrentUserId, request);
		return CreatedAtAction(nameof(GetById), new { id = result.ExamId },
			ApiResponse<ExamDto>.Ok(result, "Tạo kỳ thi thành công."));
	}

	[HttpPut("{id:guid}")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Update(Guid id, [FromBody] UpdateExamRequest request)
	{
		var result = await _examService.UpdateAsync(id, request);
		return Ok(ApiResponse<ExamDto>.Ok(result, "Cập nhật kỳ thi thành công."));
	}

	[HttpDelete("{id:guid}")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Delete(Guid id)
	{
		await _examService.DeleteAsync(id);
		return Ok(ApiResponse.Ok("Xóa kỳ thi thành công."));
	}

	[HttpPatch("{id:guid}/activate")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Activate(Guid id)
	{
		await _examService.ActivateAsync(id);
		return Ok(ApiResponse.Ok("Bật đề thi thành công."));
	}

	[HttpPatch("{id:guid}/deactivate")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Deactivate(Guid id)
	{
		await _examService.DeactivateAsync(id);
		return Ok(ApiResponse.Ok("Tắt đề thi thành công."));
	}

	[HttpGet("{id:guid}/score-distribution")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> ScoreDistribution(Guid id)
	{
		var result = await _examService.GetScoreDistributionAsync(id);
		return Ok(ApiResponse<List<ScoreDistributionDto>>.Ok(result));
	}
}

// ── ExamCodeController ────────────────────────────────────────────
[Route("api/exams/{examId:guid}/codes")]
[Authorize]
public class ExamCodeController : BaseController
{
	private readonly IExamCodeService _examCodeService;
	public ExamCodeController(IExamCodeService examCodeService) => _examCodeService = examCodeService;

	[HttpGet]
	public async Task<IActionResult> GetAll(Guid examId)
	{
		var result = await _examCodeService.GetByExamAsync(examId);
		return Ok(ApiResponse<IEnumerable<ExamCodeDto>>.Ok(result));
	}

	[HttpGet("{codeId:guid}")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> GetDetail(Guid examId, Guid codeId)
	{
		var result = await _examCodeService.GetDetailAsync(examId, codeId);
		return Ok(ApiResponse<ExamCodeDetailDto>.Ok(result));
	}

	[HttpPost("generate")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Generate(Guid examId, [FromBody] GenerateCodesRequest request)
	{
		var result = await _examCodeService.GenerateCodesAsync(examId, request.Count);
		return Ok(ApiResponse<IEnumerable<ExamCodeDto>>.Ok(result, $"Đã sinh {request.Count} mã đề."));
	}

	[HttpPost("{codeId:guid}/shuffle")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Shuffle(Guid examId, Guid codeId)
	{
		var result = await _examCodeService.ShuffleAsync(examId, codeId);
		return Ok(ApiResponse<ExamCodeDto>.Ok(result, "Trộn đề thành công."));
	}

	[HttpDelete("{codeId:guid}")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> Delete(Guid examId, Guid codeId)
	{
		await _examCodeService.DeleteAsync(examId, codeId);
		return Ok(ApiResponse.Ok("Xóa mã đề thành công."));
	}

	[HttpGet("{codeId:guid}/export/word")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> ExportWord(Guid examId, Guid codeId)
	{
		var bytes = await _examCodeService.ExportToWordAsync(examId, codeId);
		return File(bytes,
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			$"dethi_{codeId}.docx");
	}

	[HttpGet("{codeId:guid}/export/pdf")]
	[Authorize(Roles = "Admin,Teacher")]
	public async Task<IActionResult> ExportPdf(Guid examId, Guid codeId)
	{
		var bytes = await _examCodeService.ExportToPdfAsync(examId, codeId);
		return File(bytes, "application/pdf", $"dethi_{codeId}.pdf");
	}
}