using LuyenThiTiengAnh.Models.Enums;

namespace LuyenThiTiengAnh.Models;

public class ReadingPassage
{
	public Guid PassageId { get; set; } = Guid.NewGuid();
	public string Title { get; set; } = null!;
	public string Content { get; set; } = null!;
	public Guid CreatedBy { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	// Navigation
	public User Creator { get; set; } = null!;
	public ICollection<Question> Questions { get; set; } = new List<Question>();
}