namespace LuyenThiTiengAnh.Models;

public class ExamCode
{
	public Guid ExamCodeId { get; set; } = Guid.NewGuid();
	public Guid ExamId { get; set; }
	public string CodeNumber { get; set; } = null!;
	public int Version { get; set; } = 1;

	// Navigation
	public Exam Exam { get; set; } = null!;
	public ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
	public ICollection<ExamAttempt> ExamAttempts { get; set; } = new List<ExamAttempt>();
}