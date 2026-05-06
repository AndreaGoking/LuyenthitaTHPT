using System.ComponentModel.DataAnnotations;
using LuyenThiTiengAnh.DTOs.Questions;

namespace LuyenThiTiengAnh.DTOs.ReadingPassages;

public class PassageDto
{
	public Guid PassageId { get; set; }
	public string Title { get; set; } = null!;
	public string Content { get; set; } = null!;
	public string CreatedByUsername { get; set; } = null!;
	public DateTime CreatedAt { get; set; }
	public int QuestionCount { get; set; }
}

public class PassageDetailDto : PassageDto
{
	public List<QuestionDto> Questions { get; set; } = new();
}

public class CreatePassageRequest
{
	[Required, MaxLength(500)] public string Title { get; set; } = null!;
	[Required] public string Content { get; set; } = null!;
}

public class UpdatePassageRequest
{
	[MaxLength(500)] public string? Title { get; set; }
	public string? Content { get; set; }
}

public class AddQuestionToPassageRequest
{
	[Required] public Guid QuestionId { get; set; }
}