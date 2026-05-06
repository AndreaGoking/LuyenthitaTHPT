namespace LuyenThiTiengAnh.Models;

public class StudentAnswer
{
	public Guid AnswerId { get; set; } = Guid.NewGuid();
	public Guid AttemptId { get; set; }
	public Guid ExamQuestionId { get; set; }

	public string? SelectedOption { get; set; }

	public bool IsCorrect { get; set; } = false;
	public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;

	// Navigation
	public ExamAttempt Attempt { get; set; } = null!;
	public ExamQuestion ExamQuestion { get; set; } = null!;
}