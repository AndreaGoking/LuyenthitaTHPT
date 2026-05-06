using LuyenThiTiengAnh.Models.Enums;

namespace LuyenThiTiengAnh.Models;

public class Question
{
	public Guid QuestionId { get; set; } = Guid.NewGuid();
	public string Content { get; set; } = null!;
	public string OptionA { get; set; } = null!;
	public string OptionB { get; set; } = null!;
	public string OptionC { get; set; } = null!;
	public string OptionD { get; set; } = null!;

	// FIX: char → string
	// Npgsql không tự map C# char sang PostgreSQL char(1) một cách đáng tin cậy.
	// Dùng string + HasMaxLength(1) trong DbContext là cách an toàn nhất.
	public string CorrectAnswer { get; set; } = null!;

	public SkillType Skill { get; set; }
	public CognitiveLevel Level { get; set; }
	public string Topic { get; set; } = null!;
	public string? Source { get; set; }
	public Guid? PassageId { get; set; }

	// Audit: Create
	public Guid CreatedBy { get; set; }
	public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

	// Audit: Update
	public Guid? UpdatedBy { get; set; }
	public DateTime? UpdatedAt { get; set; }

	// Soft delete
	public bool IsDeleted { get; set; } = false;
	public Guid? DeletedBy { get; set; }
	public DateTime? DeletedAt { get; set; }

	// Navigation
	public User Creator { get; set; } = null!;
	public User? Updater { get; set; }
	public User? Deleter { get; set; }
	public ReadingPassage? Passage { get; set; }
	public QuestionStatistics? Statistics { get; set; }
	public ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
}