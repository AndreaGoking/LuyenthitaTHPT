namespace LuyenThiTiengAnh.DTOs.ExamResults;

public class ExamResultDto
{
	public Guid ResultId { get; set; }
	public Guid AttemptId { get; set; }
	public string ExamTitle { get; set; } = null!;
	public string CodeNumber { get; set; } = null!;
	public decimal Score { get; set; }
	public int CorrectCount { get; set; }
	public int WrongCount { get; set; }
	public int TotalQuestions { get; set; }
	public decimal CorrectPercent { get; set; }
	public bool IsAutoSubmitted { get; set; }
	public DateTime SubmitTime { get; set; }
}

public class AnswerDetailDto
{
	public int DisplayOrder { get; set; }
	public string QuestionContent { get; set; } = null!;
	public string OptionA { get; set; } = null!;
	public string OptionB { get; set; } = null!;
	public string OptionC { get; set; } = null!;
	public string OptionD { get; set; } = null!;

	// FIX: char → string (đồng bộ với Question.CorrectAnswer)
	public string CorrectAnswer { get; set; } = null!;

	// FIX: char? → string? (đồng bộ với StudentAnswer.SelectedOption)
	public string? SelectedOption { get; set; }

	public bool IsCorrect { get; set; }
	public string Skill { get; set; } = null!;
	public string Level { get; set; } = null!;
	public string Topic { get; set; } = null!;
}

public class ResultDetailDto : ExamResultDto
{
	public List<AnswerDetailDto> Answers { get; set; } = new();
}

public class SkillBreakdownDto
{
	public string Skill { get; set; } = null!;
	public int Total { get; set; }
	public int Correct { get; set; }
	public int Wrong { get; set; }
	public decimal CorrectRate { get; set; }
}

public class WeakTopicDto
{
	public string Topic { get; set; } = null!;
	public string Skill { get; set; } = null!;
	public int Total { get; set; }
	public int Wrong { get; set; }
	public decimal WrongRate { get; set; }
}