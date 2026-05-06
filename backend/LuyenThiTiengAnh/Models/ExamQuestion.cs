namespace LuyenThiTiengAnh.Models;

public class ExamQuestion
{
	public Guid ExamQuestionId { get; set; } = Guid.NewGuid();
	public Guid ExamCodeId { get; set; }
	public Guid QuestionId { get; set; }
	public int DisplayOrder { get; set; }

	// Navigation
	public ExamCode ExamCode { get; set; } = null!;
	public Question Question { get; set; } = null!;
	public ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();
}