using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.Questions;

// ── Response ─────────────────────────────────────────────────────
public class QuestionDto
{
	public Guid QuestionId { get; set; }
	public string Content { get; set; } = null!;
	public string OptionA { get; set; } = null!;
	public string OptionB { get; set; } = null!;
	public string OptionC { get; set; } = null!;
	public string OptionD { get; set; } = null!;

	public string CorrectAnswer { get; set; } = null!;

	public string Skill { get; set; } = null!;
	public string Level { get; set; } = null!;
	public string Topic { get; set; } = null!;
	public string? Source { get; set; }
	public Guid? PassageId { get; set; }
	public string CreatedByUsername { get; set; } = null!;
	public DateTime CreatedAt { get; set; }
}

public class QuestionListDto
{
	public Guid QuestionId { get; set; }
	public string Content { get; set; } = null!;
	public string Skill { get; set; } = null!;
	public string Level { get; set; } = null!;
	public string Topic { get; set; } = null!;
	public bool HasPassage { get; set; }
	public DateTime CreatedAt { get; set; }
}

// ── Request ──────────────────────────────────────────────────────
public class CreateQuestionRequest
{
	[Required] public string Content { get; set; } = null!;
	[Required] public string OptionA { get; set; } = null!;
	[Required] public string OptionB { get; set; } = null!;
	[Required] public string OptionC { get; set; } = null!;
	[Required] public string OptionD { get; set; } = null!;

	[Required, RegularExpression("^[ABCD]$", ErrorMessage = "CorrectAnswer phải là A, B, C hoặc D")]
	public string CorrectAnswer { get; set; } = null!;

	[Required] public string Skill { get; set; } = null!;
	[Required] public string Level { get; set; } = null!;
	[Required] public string Topic { get; set; } = null!;
	public string? Source { get; set; }
	public Guid? PassageId { get; set; }
}

public class UpdateQuestionRequest
{
	public string? Content { get; set; }
	public string? OptionA { get; set; }
	public string? OptionB { get; set; }
	public string? OptionC { get; set; }
	public string? OptionD { get; set; }

	// FIX: char? → string?
	[RegularExpression("^[ABCD]$", ErrorMessage = "CorrectAnswer phải là A, B, C hoặc D")]
	public string? CorrectAnswer { get; set; }

	public string? Skill { get; set; }
	public string? Level { get; set; }
	public string? Topic { get; set; }
	public string? Source { get; set; }
	public Guid? PassageId { get; set; }
}

public class QuestionFilterRequest
{
	public string? Skill { get; set; }
	public string? Level { get; set; }
	public string? Topic { get; set; }
	public string? Source { get; set; }
	public Guid? PassageId { get; set; }
	public string? Search { get; set; }
	public int Page { get; set; } = 1;
	public int PageSize { get; set; } = 20;
}

public class ImportQuestionsResponse
{
	public int Imported { get; set; }
	public int Skipped { get; set; }
	public List<string> Errors { get; set; } = new();
}