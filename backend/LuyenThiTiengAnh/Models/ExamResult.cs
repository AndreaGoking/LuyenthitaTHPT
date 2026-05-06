namespace LuyenThiTiengAnh.Models;

public class ExamResult
{
	public Guid ResultId { get; set; } = Guid.NewGuid();
	public Guid AttemptId { get; set; }
	public decimal Score { get; set; }
	public int CorrectCount { get; set; }
	public int WrongCount { get; set; }
	public int TotalQuestions { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	// Navigation
	public ExamAttempt Attempt { get; set; } = null!;
}