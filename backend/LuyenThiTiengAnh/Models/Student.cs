namespace LuyenThiTiengAnh.Models;

public class Student
{
	public Guid StudentId { get; set; }
	public int Grade { get; set; }
	public string School { get; set; } = null!;

	// Navigation
	public User User { get; set; } = null!;
	public ICollection<ExamAttempt> ExamAttempts { get; set; } = new List<ExamAttempt>();
}