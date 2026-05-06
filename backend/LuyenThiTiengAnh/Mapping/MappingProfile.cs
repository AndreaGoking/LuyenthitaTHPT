using AutoMapper;
using LuyenThiTiengAnh.DTOs.Auth;
using LuyenThiTiengAnh.DTOs.ExamAttempts;
using LuyenThiTiengAnh.DTOs.ExamCodes;
using LuyenThiTiengAnh.DTOs.ExamMatrix;
using LuyenThiTiengAnh.DTOs.ExamResults;
using LuyenThiTiengAnh.DTOs.Exams;
using LuyenThiTiengAnh.DTOs.Questions;
using LuyenThiTiengAnh.DTOs.ReadingPassages;
using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.StudyMaterials;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Models;

namespace LuyenThiTiengAnh.Mapping;

public class MappingProfile : Profile
{
	public MappingProfile()
	{
		// ── User ────────────────────────────────────────────────
		CreateMap<User, UserInfoDto>()
			.ForMember(d => d.Role, o => o.MapFrom(s => s.Role.ToString()));

		CreateMap<User, UserListDto>()
			.ForMember(d => d.Role, o => o.MapFrom(s => s.Role.ToString()));

		CreateMap<User, UserDto>()
			.ForMember(d => d.Role, o => o.MapFrom(s => s.Role.ToString()))
			.ForMember(d => d.School, o => o.MapFrom(s =>
				s.Teacher != null ? s.Teacher.School :
				s.Student != null ? s.Student.School : null))
			.ForMember(d => d.Grade, o => o.MapFrom(s =>
				s.Student != null ? (int?)s.Student.Grade : null));

		CreateMap<User, ProfileDto>()
			.ForMember(d => d.Role, o => o.MapFrom(s => s.Role.ToString()))
			.ForMember(d => d.School, o => o.MapFrom(s =>
				s.Teacher != null ? s.Teacher.School :
				s.Student != null ? s.Student.School : null))
			.ForMember(d => d.Grade, o => o.MapFrom(s =>
				s.Student != null ? (int?)s.Student.Grade : null));

		// ── Question ─────────────────────────────────────────────
		CreateMap<Question, QuestionDto>()
			.ForMember(d => d.Skill, o => o.MapFrom(s => s.Skill.ToString()))
			.ForMember(d => d.Level, o => o.MapFrom(s => s.Level.ToString()))
			.ForMember(d => d.CreatedByUsername, o => o.MapFrom(s => s.Creator.Username));

		CreateMap<Question, QuestionListDto>()
			.ForMember(d => d.Skill, o => o.MapFrom(s => s.Skill.ToString()))
			.ForMember(d => d.Level, o => o.MapFrom(s => s.Level.ToString()))
			.ForMember(d => d.HasPassage, o => o.MapFrom(s => s.PassageId.HasValue));

		// ── ReadingPassage ───────────────────────────────────────
		CreateMap<ReadingPassage, PassageDto>()
			.ForMember(d => d.CreatedByUsername, o => o.MapFrom(s => s.Creator.Username))
			.ForMember(d => d.QuestionCount, o => o.MapFrom(s => s.Questions.Count));

		CreateMap<ReadingPassage, PassageDetailDto>()
			.IncludeBase<ReadingPassage, PassageDto>();

		// ── ExamMatrix ───────────────────────────────────────────
		CreateMap<SkillDistribution, SkillDistributionDto>()
			.ForMember(d => d.Skill, o => o.MapFrom(s => s.Skill.ToString()));

		CreateMap<ExamMatrix, ExamMatrixDto>()
			.ForMember(d => d.TotalQuestions,
				o => o.MapFrom(s => s.SkillDistributions.Sum(sd => sd.QuestionCount)));

		// ── Exam ─────────────────────────────────────────────────
		CreateMap<Exam, ExamListDto>()
			.ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
			.ForMember(d => d.CreatedByUsername, o => o.MapFrom(s => s.Creator.Username));

		CreateMap<Exam, ExamDto>()
			.IncludeBase<Exam, ExamListDto>()
			.ForMember(d => d.MatrixName, o => o.MapFrom(s => s.Matrix.Name))
			.ForMember(d => d.ParticipantCount, o => o.Ignore()); // computed in service

		// ── ExamCode ─────────────────────────────────────────────
		CreateMap<ExamCode, ExamCodeDto>()
			.ForMember(d => d.QuestionCount, o => o.MapFrom(s => s.ExamQuestions.Count));

		CreateMap<ExamQuestion, ExamQuestionDto>()
			.ForMember(d => d.Content, o => o.MapFrom(s => s.Question.Content))
			.ForMember(d => d.OptionA, o => o.MapFrom(s => s.Question.OptionA))
			.ForMember(d => d.OptionB, o => o.MapFrom(s => s.Question.OptionB))
			.ForMember(d => d.OptionC, o => o.MapFrom(s => s.Question.OptionC))
			.ForMember(d => d.OptionD, o => o.MapFrom(s => s.Question.OptionD))
			.ForMember(d => d.Skill, o => o.MapFrom(s => s.Question.Skill.ToString()))
			.ForMember(d => d.Level, o => o.MapFrom(s => s.Question.Level.ToString()))
			.ForMember(d => d.PassageId, o => o.MapFrom(s => s.Question.PassageId));

		// ── ExamAttempt ──────────────────────────────────────────
		CreateMap<ExamAttempt, AttemptHistoryDto>()
			.ForMember(d => d.ExamTitle, o => o.MapFrom(s => s.ExamCode.Exam.Title))
			.ForMember(d => d.CodeNumber, o => o.MapFrom(s => s.ExamCode.CodeNumber))
			.ForMember(d => d.Score, o => o.MapFrom(s =>
				s.ExamResult != null ? (decimal?)s.ExamResult.Score : null));

		// ── ExamResult ───────────────────────────────────────────
		CreateMap<ExamResult, ExamResultDto>()
			.ForMember(d => d.ExamTitle, o => o.MapFrom(s => s.Attempt.ExamCode.Exam.Title))
			.ForMember(d => d.CodeNumber, o => o.MapFrom(s => s.Attempt.ExamCode.CodeNumber))
			.ForMember(d => d.IsAutoSubmitted, o => o.MapFrom(s => s.Attempt.IsAutoSubmitted))
			.ForMember(d => d.SubmitTime, o => o.MapFrom(s => s.Attempt.SubmitTime!.Value))
			.ForMember(d => d.CorrectPercent, o => o.MapFrom(s =>
				s.TotalQuestions > 0
					? Math.Round((decimal)s.CorrectCount / s.TotalQuestions * 100, 1)
					: 0));

		CreateMap<ExamResult, ResultDetailDto>()
			.ForMember(d => d.ExamTitle, o => o.MapFrom(s => s.Attempt.ExamCode.Exam.Title))
			.ForMember(d => d.CodeNumber, o => o.MapFrom(s => s.Attempt.ExamCode.CodeNumber))
			.ForMember(d => d.SubmitTime, o => o.MapFrom(s => s.Attempt.SubmitTime))
			.ForMember(d => d.IsAutoSubmitted, o => o.MapFrom(s => s.Attempt.IsAutoSubmitted))
			.ForMember(d => d.CorrectPercent, o => o.MapFrom(s =>
				s.TotalQuestions > 0
					? Math.Round((decimal)s.CorrectCount / s.TotalQuestions * 100, 1)
					: 0))
			.ForMember(d => d.Answers, o => o.Ignore()); // Answers được gán thủ công trong service

		// ── QuestionStatistics ───────────────────────────────────
		CreateMap<QuestionStatistics, QuestionStatisticsDto>()
			.ForMember(d => d.Content, o => o.MapFrom(s => s.Question.Content))
			.ForMember(d => d.Skill, o => o.MapFrom(s => s.Question.Skill.ToString()))
			.ForMember(d => d.Level, o => o.MapFrom(s => s.Question.Level.ToString()))
			.ForMember(d => d.Topic, o => o.MapFrom(s => s.Question.Topic))
			.ForMember(d => d.WrongRatePct, o => o.MapFrom(s => Math.Round(s.WrongRate * 100, 1)));

		// ── StudyMaterial ────────────────────────────────────────
		CreateMap<StudyMaterial, StudyMaterialListDto>()
			.ForMember(d => d.Skill, o => o.MapFrom(s => s.Skill.ToString()))
			.ForMember(d => d.CreatedByUsername, o => o.MapFrom(s => s.Creator.Username));

		CreateMap<StudyMaterial, StudyMaterialDto>()
			.IncludeBase<StudyMaterial, StudyMaterialListDto>();
	}
}