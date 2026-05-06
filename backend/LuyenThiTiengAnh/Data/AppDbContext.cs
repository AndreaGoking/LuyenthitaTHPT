using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

	// ── DbSets ──────────────────────────────────────────────────
	public DbSet<User> Users => Set<User>();
	public DbSet<Teacher> Teachers => Set<Teacher>();
	public DbSet<Student> Students => Set<Student>();
	public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

	public DbSet<ReadingPassage> ReadingPassages => Set<ReadingPassage>();
	public DbSet<Question> Questions => Set<Question>();
	public DbSet<QuestionStatistics> QuestionStatistics => Set<QuestionStatistics>();

	public DbSet<ExamMatrix> ExamMatrices => Set<ExamMatrix>();
	public DbSet<SkillDistribution> SkillDistributions => Set<SkillDistribution>();

	public DbSet<Exam> Exams => Set<Exam>();
	public DbSet<ExamCode> ExamCodes => Set<ExamCode>();
	public DbSet<ExamQuestion> ExamQuestions => Set<ExamQuestion>();

	public DbSet<ExamAttempt> ExamAttempts => Set<ExamAttempt>();
	public DbSet<StudentAnswer> StudentAnswers => Set<StudentAnswer>();
	public DbSet<ExamResult> ExamResults => Set<ExamResult>();

	public DbSet<StudyMaterial> StudyMaterials => Set<StudyMaterial>();

	// ── Fluent API ───────────────────────────────────────────────
	protected override void OnModelCreating(ModelBuilder mb)
	{
		base.OnModelCreating(mb);

		// ════════════════════════════════════════════════════════
		// USER
		// ════════════════════════════════════════════════════════
		mb.Entity<User>(e =>
		{
			e.ToTable("users");   // tên bảng trong PostgreSQL (chữ thường)

			e.HasKey(x => x.UserId);
			e.HasIndex(x => x.Username).IsUnique();
			e.HasIndex(x => x.Email).IsUnique();

			// Map từng property -> tên cột trong DB (chữ thường, viết liền)
			e.Property(x => x.UserId).HasColumnName("userid");
			e.Property(x => x.Username).HasColumnName("username");
			e.Property(x => x.Email).HasColumnName("email");
			e.Property(x => x.PasswordHash).HasColumnName("passwordhash");
			e.Property(x => x.Role)
				.HasConversion<string>()
				.HasMaxLength(20)
				.HasColumnName("role");
			e.Property(x => x.IsActive).HasColumnName("isactive");
			e.Property(x => x.CreatedAt).HasColumnName("createdat");
			e.Property(x => x.LastLoginAt).HasColumnName("lastloginat");
		});

		// ════════════════════════════════════════════════════════
		// TEACHER
		// FIX: Bỏ toàn bộ HasMany cho Questions/ReadingPassages/Exams/StudyMaterials
		// vì các entity đó đã tự config HasOne(Creator) với FK = CreatedBy → Users.
		// Việc cấu hình cả 2 phía gây lỗi "conflicting FK configuration" với Npgsql.
		// Navigation Teacher.Questions vẫn dùng được bằng cách Include/Query thủ công.
		// ════════════════════════════════════════════════════════
		mb.Entity<Teacher>(e =>
		{
			e.ToTable("teachers");   // tên bảng thực tế (chữ thường)

			e.HasKey(x => x.TeacherId);
			e.Property(x => x.TeacherId).HasColumnName("teacherid");
			e.Property(x => x.School).HasColumnName("school");

			e.HasOne(x => x.User)
				.WithOne(u => u.Teacher)
				.HasForeignKey<Teacher>(x => x.TeacherId);
		});

		// ════════════════════════════════════════════════════════
		// STUDENT
		// ════════════════════════════════════════════════════════
		mb.Entity<Student>(e =>
		{
			e.ToTable("students");
			e.HasKey(x => x.StudentId);
			e.Property(x => x.StudentId).HasColumnName("studentid");
			e.Property(x => x.Grade).HasColumnName("grade");
			e.Property(x => x.School).HasColumnName("school");

			e.HasOne(x => x.User)
				.WithOne(u => u.Student)
				.HasForeignKey<Student>(x => x.StudentId);
		});

		// ════════════════════════════════════════════════════════
		// REFRESH TOKEN
		// ════════════════════════════════════════════════════════
		mb.Entity<RefreshToken>(e =>
		{
			e.ToTable("refreshtokens");   // tên bảng thực tế (chữ thường)

			e.HasKey(x => x.Id);
			e.Property(x => x.Id).HasColumnName("id");
			e.Property(x => x.UserId).HasColumnName("userid");
			e.Property(x => x.Token).HasColumnName("token");
			e.Property(x => x.ExpiresAt).HasColumnName("expiresat");
			e.Property(x => x.IsRevoked).HasColumnName("isrevoked");
			e.Property(x => x.CreatedAt).HasColumnName("createdat");

			e.HasIndex(x => x.Token).IsUnique();
			e.HasOne(x => x.User)
				.WithMany(u => u.RefreshTokens)
				.HasForeignKey(x => x.UserId)
				.OnDelete(DeleteBehavior.Cascade);
		});

		// ════════════════════════════════════════════════════════
		// READING PASSAGE
		// ════════════════════════════════════════════════════════
		mb.Entity<ReadingPassage>(e =>
		{
			e.ToTable("readingpassages");   // ← sửa lại tên bảng (thêm 's')

			e.HasKey(x => x.PassageId);
			e.Property(x => x.PassageId).HasColumnName("passageid");
			e.Property(x => x.Title).HasColumnName("title");
			e.Property(x => x.Content).HasColumnName("content");
			e.Property(x => x.CreatedBy).HasColumnName("createdby");
			e.Property(x => x.CreatedAt).HasColumnName("createdat");

			e.HasOne(x => x.Creator)
			 .WithMany()
			 .HasForeignKey(x => x.CreatedBy)
			 .OnDelete(DeleteBehavior.Restrict);
		});

		// ════════════════════════════════════════════════════════
		// QUESTION
		// ════════════════════════════════════════════════════════
		mb.Entity<Question>(e =>
		{
			e.ToTable("questions");
			e.HasKey(x => x.QuestionId);
			e.Property(x => x.QuestionId).HasColumnName("questionid");
			e.Property(x => x.Content).HasColumnName("content");
			e.Property(x => x.OptionA).HasColumnName("optiona");
			e.Property(x => x.OptionB).HasColumnName("optionb");
			e.Property(x => x.OptionC).HasColumnName("optionc");
			e.Property(x => x.OptionD).HasColumnName("optiond");
			e.Property(x => x.CorrectAnswer).HasColumnName("correctanswer").HasMaxLength(1);
			e.Property(x => x.Skill).HasColumnName("skill").HasConversion<string>();
			e.Property(x => x.Level).HasColumnName("level").HasConversion<string>();
			e.Property(x => x.Topic).HasColumnName("topic");
			e.Property(x => x.Source).HasColumnName("source");
			e.Property(x => x.PassageId).HasColumnName("passageid");
			e.Property(x => x.CreatedBy).HasColumnName("createdby");
			e.Property(x => x.CreatedAt).HasColumnName("createdat");
			e.Property(x => x.UpdatedBy).HasColumnName("updatedby");
			e.Property(x => x.UpdatedAt).HasColumnName("updatedat");
			e.Property(x => x.IsDeleted).HasColumnName("isdeleted");
			e.Property(x => x.DeletedBy).HasColumnName("deletedby");
			e.Property(x => x.DeletedAt).HasColumnName("deletedat");

			e.HasOne(x => x.Creator).WithMany().HasForeignKey(x => x.CreatedBy).OnDelete(DeleteBehavior.Restrict);
			e.HasOne(x => x.Updater).WithMany().HasForeignKey(x => x.UpdatedBy).OnDelete(DeleteBehavior.Restrict);
			e.HasOne(x => x.Deleter).WithMany().HasForeignKey(x => x.DeletedBy).OnDelete(DeleteBehavior.Restrict);
			e.HasOne(x => x.Passage).WithMany(p => p.Questions).HasForeignKey(x => x.PassageId).OnDelete(DeleteBehavior.SetNull);
			e.HasQueryFilter(x => !x.IsDeleted);
			e.HasIndex(x => new { x.Skill, x.Level });
			e.HasIndex(x => x.Topic);
		});

		// ════════════════════════════════════════════════════════
		// QUESTION STATISTICS
		// ════════════════════════════════════════════════════════
		mb.Entity<QuestionStatistics>(e =>
		{
			e.ToTable("questionstatistics");   // ← thêm dòng này

			e.HasKey(x => x.QuestionId);
			e.Property(x => x.QuestionId).HasColumnName("questionid");
			e.Property(x => x.TotalAttempts).HasColumnName("totalattempts");
			e.Property(x => x.WrongCount).HasColumnName("wrongcount");
			e.Property(x => x.WrongRate).HasColumnName("wrongrate").HasPrecision(5, 4);
			e.Property(x => x.IsDifficult).HasColumnName("isdifficult");
			e.Property(x => x.LastUpdated).HasColumnName("lastupdated");

			e.HasOne(x => x.Question)
				.WithOne(q => q.Statistics)
				.HasForeignKey<QuestionStatistics>(x => x.QuestionId);
		});

		// ════════════════════════════════════════════════════════
		// EXAM MATRIX
		// ════════════════════════════════════════════════════════
		mb.Entity<ExamMatrix>(e =>
		{
			e.ToTable("exammatrices");
			e.HasKey(x => x.MatrixId);
			e.Property(x => x.MatrixId).HasColumnName("matrixid");
			e.Property(x => x.Name).HasColumnName("name");
			e.Property(x => x.RecognitionRate).HasColumnName("recognitionrate").HasPrecision(5, 2);
			e.Property(x => x.UnderstandingRate).HasColumnName("understandingrate").HasPrecision(5, 2);
			e.Property(x => x.ApplicationRate).HasColumnName("applicationrate").HasPrecision(5, 2);
			e.Property(x => x.HighAppRate).HasColumnName("highapprate").HasPrecision(5, 2);
		});

		// ════════════════════════════════════════════════════════
		// SKILL DISTRIBUTION
		// ════════════════════════════════════════════════════════
		mb.Entity<SkillDistribution>(e =>
		{
			e.ToTable("skilldistributions");
			e.HasKey(x => x.DistributionId);
			e.Property(x => x.DistributionId).HasColumnName("distributionid");
			e.Property(x => x.MatrixId).HasColumnName("matrixid");
			e.Property(x => x.Skill).HasColumnName("skill").HasConversion<string>().HasMaxLength(50);
			e.Property(x => x.QuestionCount).HasColumnName("questioncount");
			e.HasOne(x => x.Matrix)
				.WithMany(m => m.SkillDistributions)
				.HasForeignKey(x => x.MatrixId)
				.OnDelete(DeleteBehavior.Cascade);
			e.HasIndex(x => new { x.MatrixId, x.Skill }).IsUnique();
		});

		// ════════════════════════════════════════════════════════
		// EXAM
		// ════════════════════════════════════════════════════════
		mb.Entity<Exam>(e =>
		{
			e.ToTable("exams");
			e.HasKey(x => x.ExamId);
			e.Property(x => x.ExamId).HasColumnName("examid");
			e.Property(x => x.Title).HasColumnName("title");
			e.Property(x => x.DurationMinutes).HasColumnName("durationminutes");
			e.Property(x => x.Status).HasColumnName("status")
				.HasConversion<string>()
				.HasMaxLength(20);
			e.Property(x => x.TotalCodes).HasColumnName("totalcodes");
			e.Property(x => x.OpenTime).HasColumnName("opentime");
			e.Property(x => x.CloseTime).HasColumnName("closetime");
			e.Property(x => x.MatrixId).HasColumnName("matrixid");
			e.Property(x => x.CreatedBy).HasColumnName("createdby");
			e.Property(x => x.CreatedAt).HasColumnName("createdat");

			e.HasOne(x => x.Matrix)
				.WithMany(m => m.Exams)
				.HasForeignKey(x => x.MatrixId)
				.OnDelete(DeleteBehavior.Restrict);
			e.HasOne(x => x.Creator)
				.WithMany()
				.HasForeignKey(x => x.CreatedBy)
				.OnDelete(DeleteBehavior.Restrict);
		});

		// ════════════════════════════════════════════════════════
		// EXAM CODE
		// ════════════════════════════════════════════════════════
		mb.Entity<ExamCode>(e =>
		{
			e.ToTable("examcodes");
			e.HasKey(x => x.ExamCodeId);
			e.Property(x => x.ExamCodeId).HasColumnName("examcodeid");
			e.Property(x => x.ExamId).HasColumnName("examid");
			e.Property(x => x.CodeNumber).HasColumnName("codenumber");
			e.Property(x => x.Version).HasColumnName("version");
			e.HasOne(x => x.Exam)
				.WithMany(ex => ex.ExamCodes)
				.HasForeignKey(x => x.ExamId)
				.OnDelete(DeleteBehavior.Cascade);
			e.HasIndex(x => new { x.ExamId, x.CodeNumber }).IsUnique();
		});


		// ════════════════════════════════════════════════════════
		// EXAM QUESTION
		// ════════════════════════════════════════════════════════
		mb.Entity<ExamQuestion>(e =>
		{
			e.ToTable("examquestions");
			e.HasKey(x => x.ExamQuestionId);
			e.Property(x => x.ExamQuestionId).HasColumnName("examquestionid");
			e.Property(x => x.ExamCodeId).HasColumnName("examcodeid");
			e.Property(x => x.QuestionId).HasColumnName("questionid");
			e.Property(x => x.DisplayOrder).HasColumnName("displayorder");
			e.HasOne(x => x.ExamCode)
				.WithMany(ec => ec.ExamQuestions)
				.HasForeignKey(x => x.ExamCodeId)
				.OnDelete(DeleteBehavior.Cascade);
			e.HasOne(x => x.Question)
				.WithMany(q => q.ExamQuestions)
				.HasForeignKey(x => x.QuestionId)
				.OnDelete(DeleteBehavior.Restrict);
			e.HasIndex(x => new { x.ExamCodeId, x.DisplayOrder }).IsUnique();
			e.HasIndex(x => new { x.ExamCodeId, x.QuestionId }).IsUnique();
		});

		// ════════════════════════════════════════════════════════
		// EXAM ATTEMPT
		// ════════════════════════════════════════════════════════
		mb.Entity<ExamAttempt>(e =>
		{
			e.ToTable("examattempts");
			e.HasKey(x => x.AttemptId);
			e.Property(x => x.AttemptId).HasColumnName("attemptid");
			e.Property(x => x.StudentId).HasColumnName("studentid");
			e.Property(x => x.ExamCodeId).HasColumnName("examcodeid");
			e.Property(x => x.StartTime).HasColumnName("starttime");
			e.Property(x => x.SubmitTime).HasColumnName("submittime");
			e.Property(x => x.IsSubmitted).HasColumnName("issubmitted");
			e.Property(x => x.IsAutoSubmitted).HasColumnName("isautosubmitted");

			// ✅ Chỉ rõ navigation property ở phía Student
			e.HasOne(x => x.Student)
				.WithMany(s => s.ExamAttempts)   // ← sửa ở đây
				.HasForeignKey(x => x.StudentId)
				.OnDelete(DeleteBehavior.Restrict);

			e.HasOne(x => x.ExamCode)
				.WithMany(ec => ec.ExamAttempts)
				.HasForeignKey(x => x.ExamCodeId)
				.OnDelete(DeleteBehavior.Restrict);

			e.HasIndex(x => x.StudentId);
		});

		// ════════════════════════════════════════════════════════
		// STUDENT ANSWER
		// ════════════════════════════════════════════════════════
		mb.Entity<StudentAnswer>(e =>
		{
			e.ToTable("studentanswers");
			e.HasKey(x => x.AnswerId);
			e.Property(x => x.AnswerId).HasColumnName("answerid");
			e.Property(x => x.AttemptId).HasColumnName("attemptid");
			e.Property(x => x.ExamQuestionId).HasColumnName("examquestionid");
			e.Property(x => x.SelectedOption).HasColumnName("selectedoption").HasMaxLength(1);
			e.Property(x => x.IsCorrect).HasColumnName("iscorrect");
			e.Property(x => x.AnsweredAt).HasColumnName("answeredat");
			e.HasOne(x => x.Attempt)
				.WithMany(a => a.StudentAnswers)
				.HasForeignKey(x => x.AttemptId)
				.OnDelete(DeleteBehavior.Cascade);
			e.HasOne(x => x.ExamQuestion)
				.WithMany(eq => eq.StudentAnswers)
				.HasForeignKey(x => x.ExamQuestionId)
				.OnDelete(DeleteBehavior.Restrict);
			e.HasIndex(x => new { x.AttemptId, x.ExamQuestionId }).IsUnique();
		});

		// ════════════════════════════════════════════════════════
		// EXAM RESULT
		// ════════════════════════════════════════════════════════
		mb.Entity<ExamResult>(e =>
		{
			e.ToTable("examresults");
			e.HasKey(x => x.ResultId);
			e.Property(x => x.ResultId).HasColumnName("resultid");
			e.Property(x => x.AttemptId).HasColumnName("attemptid");
			e.Property(x => x.Score).HasColumnName("score").HasPrecision(5, 2);
			e.Property(x => x.CorrectCount).HasColumnName("correctcount");
			e.Property(x => x.WrongCount).HasColumnName("wrongcount");
			e.Property(x => x.TotalQuestions).HasColumnName("totalquestions");
			e.Property(x => x.CreatedAt).HasColumnName("createdat");
			e.HasOne(x => x.Attempt)
				.WithOne(a => a.ExamResult)
				.HasForeignKey<ExamResult>(x => x.AttemptId)
				.OnDelete(DeleteBehavior.Restrict);
			e.HasIndex(x => x.AttemptId).IsUnique();
		});

		// ════════════════════════════════════════════════════════
		// STUDY MATERIAL
		// ════════════════════════════════════════════════════════
		mb.Entity<StudyMaterial>(e =>
		{
			e.ToTable("studymaterials");
			e.HasKey(x => x.MaterialId);
			e.Property(x => x.MaterialId).HasColumnName("materialid");
			e.Property(x => x.Title).HasColumnName("title");
			e.Property(x => x.Topic).HasColumnName("topic");
			e.Property(x => x.Content).HasColumnName("content");
			e.Property(x => x.Skill).HasColumnName("skill").HasConversion<string>().HasMaxLength(50);
			e.Property(x => x.CreatedBy).HasColumnName("createdby");
			e.Property(x => x.CreatedAt).HasColumnName("createdat");
			e.HasOne(x => x.Creator)
				.WithMany()
				.HasForeignKey(x => x.CreatedBy)
				.OnDelete(DeleteBehavior.Restrict);
		});
	}
}