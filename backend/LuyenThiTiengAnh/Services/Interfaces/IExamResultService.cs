using LuyenThiTiengAnh.DTOs.ExamResults;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IExamResultService
	{
		Task<ExamResultDto> GetResultAsync(Guid attemptId, Guid userId);
		Task<ResultDetailDto> GetDetailAsync(Guid attemptId, Guid userId);
		Task<List<SkillBreakdownDto>> GetSkillBreakdownAsync(Guid attemptId, Guid userId);
		Task<List<WeakTopicDto>> GetWeakTopicsAsync(Guid attemptId, Guid userId);
	}
}
