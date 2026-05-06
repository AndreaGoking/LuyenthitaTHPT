using LuyenThiTiengAnh.Models.Enums;

namespace LuyenThiTiengAnh.Models;

public class SkillDistribution
{
	public Guid DistributionId { get; set; } = Guid.NewGuid();
	public Guid MatrixId { get; set; }
	public SkillType Skill { get; set; }
	public int QuestionCount { get; set; }

	// Navigation
	public ExamMatrix Matrix { get; set; } = null!;
}