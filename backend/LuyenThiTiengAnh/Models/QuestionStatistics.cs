namespace LuyenThiTiengAnh.Models;

public class QuestionStatistics
{
	public Guid QuestionId { get; set; }
	public int TotalAttempts { get; set; } = 0;
	public int WrongCount { get; set; } = 0;
	public decimal WrongRate { get; set; } = 0;
	public bool IsDifficult { get; set; } = false;
	public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

	// Navigation
	public Question Question { get; set; } = null!;
}