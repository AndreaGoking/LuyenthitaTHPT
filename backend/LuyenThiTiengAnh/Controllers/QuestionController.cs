using LuyenThiTiengAnh.DTOs.Questions;
using LuyenThiTiengAnh.DTOs.ReadingPassages;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Helpers;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LuyenThiTiengAnh.Controllers;

// ── QuestionController ────────────────────────────────────────────
[Route("api/questions")]
[Authorize(Roles = "Admin,Teacher")]
public class QuestionController : BaseController
{
	private readonly IQuestionService _questionService;
	public QuestionController(IQuestionService questionService) 
	{
		_questionService = questionService;
	}

	/// <summary>GET /api/questions</summary>
	[HttpGet]
	public async Task<IActionResult> GetAll([FromQuery] QuestionFilterRequest filter)
	{
		var result = await _questionService.GetQuestionsAsync(filter);
		return Ok(ApiResponse<PagedResult<QuestionListDto>>.Ok(result));
	}

	/// <summary>GET /api/questions/{id}</summary>
	[HttpGet("{id:guid}")]
	public async Task<IActionResult> GetById(Guid id)
	{
		var result = await _questionService.GetByIdAsync(id);
		return Ok(ApiResponse<QuestionDto>.Ok(result));
	}

	/// <summary>POST /api/questions</summary>
	[HttpPost]
	public async Task<IActionResult> Create([FromBody] CreateQuestionRequest request)
	{
		var result = await _questionService.CreateAsync(CurrentUserId, request);
		return CreatedAtAction(nameof(GetById), new { id = result.QuestionId },
			ApiResponse<QuestionDto>.Ok(result, "Tạo câu hỏi thành công."));
	}

	/// <summary>PUT /api/questions/{id}</summary>
	[HttpPut("{id:guid}")]
	public async Task<IActionResult> Update(Guid id, [FromBody] UpdateQuestionRequest request)
	{
		var result = await _questionService.UpdateAsync(id, CurrentUserId, request);
		return Ok(ApiResponse<QuestionDto>.Ok(result, "Cập nhật câu hỏi thành công."));
	}

	/// <summary>DELETE /api/questions/{id}</summary>
	[HttpDelete("{id:guid}")]
	public async Task<IActionResult> Delete(Guid id)
	{
		await _questionService.DeleteAsync(id, CurrentUserId);
		return Ok(ApiResponse.Ok("Xóa câu hỏi thành công."));
	}

	/// <summary>POST /api/questions/import</summary>
	[HttpPost("import")]
	public async Task<IActionResult> Import(IFormFile file)
	{
		if (file is null || file.Length == 0)
			return BadRequest(ApiResponse.Fail("Vui lòng chọn file Word hợp lệ."));

		await using var stream = file.OpenReadStream();
		var result = await _questionService.ImportFromWordAsync(CurrentUserId, stream, file.FileName);
		return Ok(ApiResponse<ImportQuestionsResponse>.Ok(result));
	}
}

// ── ReadingPassageController ──────────────────────────────────────
[Route("api/reading-passages")]
[Authorize(Roles = "Admin,Teacher")]
public class ReadingPassageController : BaseController
{
	private readonly IReadingPassageService _readingPassageService;
	public ReadingPassageController(IReadingPassageService readingPassageService) => _readingPassageService = readingPassageService;

	/// <summary>GET /api/reading-passages</summary>
	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var result = await _readingPassageService.GetAllAsync();
		return Ok(ApiResponse<IEnumerable<PassageDto>>.Ok(result));
	}

	/// <summary>GET /api/reading-passages/{id}</summary>
	[HttpGet("{id:guid}")]
	public async Task<IActionResult> GetById(Guid id)
	{
		var result = await _readingPassageService.GetByIdAsync(id);
		return Ok(ApiResponse<PassageDetailDto>.Ok(result));
	}

	/// <summary>POST /api/reading-passages</summary>
	[HttpPost]
	public async Task<IActionResult> Create([FromBody] CreatePassageRequest request)
	{
		var result = await _readingPassageService.CreateAsync(CurrentUserId, request);
		return CreatedAtAction(nameof(GetById), new { id = result.PassageId },
			ApiResponse<PassageDto>.Ok(result, "Tạo bài đọc thành công."));
	}

	/// <summary>PUT /api/reading-passages/{id}</summary>
	[HttpPut("{id:guid}")]
	public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePassageRequest request)
	{
		var result = await _readingPassageService.UpdateAsync(id, request);
		return Ok(ApiResponse<PassageDto>.Ok(result, "Cập nhật bài đọc thành công."));
	}

	/// <summary>DELETE /api/reading-passages/{id}</summary>
	[HttpDelete("{id:guid}")]
	public async Task<IActionResult> Delete(Guid id)
	{
		await _readingPassageService.DeleteAsync(id);
		return Ok(ApiResponse.Ok("Xóa bài đọc thành công."));
	}

	/// <summary>POST /api/reading-passages/{id}/questions</summary>
	[HttpPost("{id:guid}/questions")]
	public async Task<IActionResult> AddQuestion(Guid id, [FromBody] AddQuestionToPassageRequest request)
	{
		await _readingPassageService.AddQuestionAsync(id, request.QuestionId);
		return Ok(ApiResponse.Ok("Thêm câu hỏi vào bài đọc thành công."));
	}

	/// <summary>DELETE /api/reading-passages/{id}/questions/{questionId}</summary>
	[HttpDelete("{id:guid}/questions/{questionId:guid}")]
	public async Task<IActionResult> RemoveQuestion(Guid id, Guid questionId)
	{
		await _readingPassageService.RemoveQuestionAsync(id, questionId);
		return Ok(ApiResponse.Ok("Gỡ câu hỏi khỏi bài đọc thành công."));
	}
}