using LuyenThiTiengAnh.Models.Enums;

namespace LuyenThiTiengAnh.Models;

public class Exam
{
	public Guid ExamId { get; set; } = Guid.NewGuid();
	public string Title { get; set; } = null!;
	public int DurationMinutes { get; set; }
	public ExamStatus Status { get; set; } = ExamStatus.Draft;
	public int TotalCodes { get; set; } = 1;
	public DateTime? OpenTime { get; set; }
	public DateTime? CloseTime { get; set; }
	public Guid MatrixId { get; set; }
	public Guid CreatedBy { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	// Navigation
	public ExamMatrix Matrix { get; set; } = null!;
	public User Creator { get; set; } = null!;
	public ICollection<ExamCode> ExamCodes { get; set; } = new List<ExamCode>();
}