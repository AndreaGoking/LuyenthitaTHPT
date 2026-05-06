using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.ExamAttempts;

// ── Student sees questions WITHOUT correct answers ────────────────
public class AttemptQuestionDto
{
	public Guid ExamQuestionId { get; set; }
	public int DisplayOrder { get; set; }
	public string Content { get; set; } = null!;
	public string OptionA { get; set; } = null!;
	public string OptionB { get; set; } = null!;
	public string OptionC { get; set; } = null!;
	public string OptionD { get; set; } = null!;
	public Guid? PassageId { get; set; }

	// FIX: char? → string?  (đồng bộ với StudentAnswer.SelectedOption)
	public string? SelectedOption { get; set; }
}

public class AttemptDto
{
	public Guid AttemptId { get; set; }
	public Guid ExamCodeId { get; set; }
	public string CodeNumber { get; set; } = null!;
	public string ExamTitle { get; set; } = null!;
	public int DurationMinutes { get; set; }
	public DateTime StartTime { get; set; }
	public bool IsSubmitted { get; set; }
	public int RemainingSeconds { get; set; }
	public List<AttemptQuestionDto> Questions { get; set; } = new();
}

public class AttemptHistoryDto
{
	public Guid AttemptId { get; set; }
	public string ExamTitle { get; set; } = null!;
	public string CodeNumber { get; set; } = null!;
	public DateTime StartTime { get; set; }
	public DateTime? SubmitTime { get; set; }
	public bool IsSubmitted { get; set; }
	public bool IsAutoSubmitted { get; set; }
	public decimal? Score { get; set; }
}

public class StartAttemptRequest
{
	[Required] public Guid ExamCodeId { get; set; }
}

public class SaveAnswerRequest
{
	[Required] public Guid ExamQuestionId { get; set; }

	// FIX: char? → string?
	// Validation vẫn giữ nguyên qua RegularExpression
	[RegularExpression("^[ABCD]$", ErrorMessage = "SelectedOption phải là A, B, C hoặc D")]
	public string? SelectedOption { get; set; }
}

public class SaveAnswersBatchRequest
{
	[Required] public List<SaveAnswerRequest> Answers { get; set; } = new();
}