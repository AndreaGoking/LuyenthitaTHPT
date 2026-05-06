using LuyenThiTiengAnh.Models.Enums;

namespace LuyenThiTiengAnh.Models;

public class StudyMaterial
{
	public Guid MaterialId { get; set; } = Guid.NewGuid();
	public string Title { get; set; } = null!;
	public string Topic { get; set; } = null!;
	public string Content { get; set; } = null!;
	public SkillType Skill { get; set; }
	public Guid CreatedBy { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	// Navigation
	public User Creator { get; set; } = null!;
}