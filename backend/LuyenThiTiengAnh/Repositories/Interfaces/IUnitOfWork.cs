using LuyenThiTiengAnh.Models;

namespace LuyenThiTiengAnh.Repositories.Interfaces;

public interface IUnitOfWork : IDisposable
{
	IGenericRepository<User> Users { get; }
	IGenericRepository<Teacher> Teachers { get; }
	IGenericRepository<Student> Students { get; }
	IGenericRepository<RefreshToken> RefreshTokens { get; }
	IGenericRepository<ReadingPassage> ReadingPassages { get; }
	IGenericRepository<Question> Questions { get; }
	IGenericRepository<QuestionStatistics> QuestionStatistics { get; }
	IGenericRepository<ExamMatrix> ExamMatrices { get; }
	IGenericRepository<SkillDistribution> SkillDistributions { get; }
	IGenericRepository<Exam> Exams { get; }
	IGenericRepository<ExamCode> ExamCodes { get; }
	IGenericRepository<ExamQuestion> ExamQuestions { get; }
	IGenericRepository<ExamAttempt> ExamAttempts { get; }
	IGenericRepository<StudentAnswer> StudentAnswers { get; }
	IGenericRepository<ExamResult> ExamResults { get; }
	IGenericRepository<StudyMaterial> StudyMaterials { get; }

	Task<int> SaveChangesAsync();
}