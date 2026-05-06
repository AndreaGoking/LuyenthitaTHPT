namespace LuyenThiTiengAnh.DTOs.Statistics;

// ── Admin Statistics ─────────────────────────────────────────────
public class SystemOverviewDto
{
	public int TotalUsers { get; set; }
	public int TotalTeachers { get; set; }
	public int TotalStudents { get; set; }
	public int TotalQuestions { get; set; }
	public int TotalExams { get; set; }
	public int ActiveExams { get; set; }
	public int TotalAttempts { get; set; }
}

public class ExamParticipantDto
{
	public string StudentUsername { get; set; } = null!;
	public string StudentEmail { get; set; } = null!;
	public string School { get; set; } = null!;
	public int Grade { get; set; }
	public string CodeNumber { get; set; } = null!;
	public DateTime StartTime { get; set; }
	public bool IsSubmitted { get; set; }
	public bool IsAutoSubmitted { get; set; }
	public decimal? Score { get; set; }
}

public class SubmissionStatusDto
{
	public int TotalParticipants { get; set; }
	public int Submitted { get; set; }
	public int AutoSubmitted { get; set; }
	public int InProgress { get; set; }
}

public class UserCountDto
{
	public int TotalUsers { get; set; }
	public int Admins { get; set; }
	public int Teachers { get; set; }
	public int Students { get; set; }
	public int ActiveUsers { get; set; }
	public int LockedUsers { get; set; }
}

// ── Question Statistics (Teacher) ────────────────────────────────
public class QuestionStatisticsDto
{
	public Guid QuestionId { get; set; }
	public string Content { get; set; } = null!;
	public string Skill { get; set; } = null!;
	public string Level { get; set; } = null!;
	public string Topic { get; set; } = null!;
	public int TotalAttempts { get; set; }
	public int WrongCount { get; set; }
	public decimal WrongRatePct { get; set; }
	public bool IsDifficult { get; set; }
}

// ── Student Progress ─────────────────────────────────────────────
public class ProgressOverviewDto
{
	public int TotalAttempts { get; set; }
	public int CompletedAttempts { get; set; }
	public decimal? AverageScore { get; set; }
	public decimal? BestScore { get; set; }
	public decimal? LatestScore { get; set; }
	public List<SkillProgressDto> SkillProgress { get; set; } = new();
}

public class SkillProgressDto
{
	public string Skill { get; set; } = null!;
	public int TotalAnswered { get; set; }
	public int TotalCorrect { get; set; }
	public decimal CorrectRate { get; set; }
}

public class ScoreTrendDto
{
	public DateTime AttemptDate { get; set; }
	public string ExamTitle { get; set; } = null!;
	public decimal Score { get; set; }
}

public class WeakTopicSummaryDto
{
	public string Topic { get; set; } = null!;
	public string Skill { get; set; } = null!;
	public decimal WrongRate { get; set; }
	public int TotalWrong { get; set; }
}