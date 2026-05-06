using LuyenThiTiengAnh.Data;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Repositories.Interfaces;

namespace LuyenThiTiengAnh.Repositories.Implementations;

public class UnitOfWork : IUnitOfWork
{
	private readonly AppDbContext _ctx;

	public UnitOfWork(AppDbContext ctx)
	{
		_ctx = ctx;

		Users = new GenericRepository<User>(ctx);
		Teachers = new GenericRepository<Teacher>(ctx);
		Students = new GenericRepository<Student>(ctx);
		RefreshTokens = new GenericRepository<RefreshToken>(ctx);
		ReadingPassages = new GenericRepository<ReadingPassage>(ctx);
		Questions = new GenericRepository<Question>(ctx);
		QuestionStatistics = new GenericRepository<QuestionStatistics>(ctx);
		ExamMatrices = new GenericRepository<ExamMatrix>(ctx);
		SkillDistributions = new GenericRepository<SkillDistribution>(ctx);
		Exams = new GenericRepository<Exam>(ctx);
		ExamCodes = new GenericRepository<ExamCode>(ctx);
		ExamQuestions = new GenericRepository<ExamQuestion>(ctx);
		ExamAttempts = new GenericRepository<ExamAttempt>(ctx);
		StudentAnswers = new GenericRepository<StudentAnswer>(ctx);
		ExamResults = new GenericRepository<ExamResult>(ctx);
		StudyMaterials = new GenericRepository<StudyMaterial>(ctx);
	}

	public IGenericRepository<User> Users { get; }
	public IGenericRepository<Teacher> Teachers { get; }
	public IGenericRepository<Student> Students { get; }
	public IGenericRepository<RefreshToken> RefreshTokens { get; }
	public IGenericRepository<ReadingPassage> ReadingPassages { get; }
	public IGenericRepository<Question> Questions { get; }
	public IGenericRepository<QuestionStatistics> QuestionStatistics { get; }
	public IGenericRepository<ExamMatrix> ExamMatrices { get; }
	public IGenericRepository<SkillDistribution> SkillDistributions { get; }
	public IGenericRepository<Exam> Exams { get; }
	public IGenericRepository<ExamCode> ExamCodes { get; }
	public IGenericRepository<ExamQuestion> ExamQuestions { get; }
	public IGenericRepository<ExamAttempt> ExamAttempts { get; }
	public IGenericRepository<StudentAnswer> StudentAnswers { get; }
	public IGenericRepository<ExamResult> ExamResults { get; }
	public IGenericRepository<StudyMaterial> StudyMaterials { get; }

	public async Task<int> SaveChangesAsync() =>
		await _ctx.SaveChangesAsync();

	public void Dispose() => _ctx.Dispose();
}