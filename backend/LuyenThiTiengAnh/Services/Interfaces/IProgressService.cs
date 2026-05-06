using LuyenThiTiengAnh.DTOs.ExamAttempts;
using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IProgressService
	{
		Task<ProgressOverviewDto> GetOverviewAsync(Guid studentId);
		Task<PagedResult<AttemptHistoryDto>> GetHistoryAsync(Guid studentId, int page, int pageSize);
		Task<List<ScoreTrendDto>> GetScoreTrendAsync(Guid studentId);
		Task<List<WeakTopicSummaryDto>> GetWeakTopicsAsync(Guid studentId);
	}
}
