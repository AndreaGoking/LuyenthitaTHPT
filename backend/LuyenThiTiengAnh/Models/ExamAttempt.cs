namespace LuyenThiTiengAnh.Models;

public class ExamAttempt
{
	public Guid AttemptId { get; set; } = Guid.NewGuid();
	public Guid StudentId { get; set; }
	public Guid ExamCodeId { get; set; }
	public DateTime StartTime { get; set; } = DateTime.UtcNow;
	public DateTime? SubmitTime { get; set; }
	public bool IsSubmitted { get; set; } = false;
	public bool IsAutoSubmitted { get; set; } = false;

	// Navigation
	public Student Student { get; set; } = null!;
	public ExamCode ExamCode { get; set; } = null!;
	public ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();
	public ExamResult? ExamResult { get; set; }
}