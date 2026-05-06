namespace LuyenThiTiengAnh.Models;

public class Teacher
{
	public Guid TeacherId { get; set; }
	public string School { get; set; } = null!;

	// Navigation
	public User User { get; set; } = null!;

	// FIX: Xóa toàn bộ 4 ICollection bên dưới.
	//
	// Nguyên nhân lỗi "column q.TeacherId does not exist":
	// EF Core thấy Teacher có ICollection<Question>, ICollection<Exam>...
	// → tự tạo shadow FK "TeacherId" trên bảng questions/exams/...
	// → conflict với FK "CreatedBy" đã được config trong AppDbContext.
	//
	// Quan hệ thực tế Teacher → Questions đã được config đúng phía Question:
	//   Question.Creator (User) → HasForeignKey(CreatedBy)
	// Nếu cần query câu hỏi của giáo viên, dùng:
	//   _uow.Questions.Query().Where(q => q.CreatedBy == teacherId)
	//
	// public ICollection<Question> Questions { get; set; }       ← XÓA
	// public ICollection<ReadingPassage> ReadingPassages { get; set; } ← XÓA
	// public ICollection<Exam> Exams { get; set; }               ← XÓA
	// public ICollection<StudyMaterial> StudyMaterials { get; set; }   ← XÓA
}