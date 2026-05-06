namespace LuyenThiTiengAnh.Models;

public class ExamMatrix
{
	public Guid MatrixId { get; set; } = Guid.NewGuid();
	public string Name { get; set; } = null!;
	public decimal RecognitionRate { get; set; }
	public decimal UnderstandingRate { get; set; }
	public decimal ApplicationRate { get; set; }
	public decimal HighAppRate { get; set; }

	// Navigation
	public ICollection<SkillDistribution> SkillDistributions { get; set; } = new List<SkillDistribution>();
	public ICollection<Exam> Exams { get; set; } = new List<Exam>();
}