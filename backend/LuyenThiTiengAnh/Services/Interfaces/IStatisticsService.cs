using LuyenThiTiengAnh.DTOs.Exams;
using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IStatisticsService
	{
		Task<SystemOverviewDto> GetOverviewAsync();
		Task<PagedResult<ExamParticipantDto>> GetParticipantsAsync(Guid examId, int page, int pageSize);
		Task<SubmissionStatusDto> GetSubmissionStatusAsync(Guid examId);
		Task<List<ScoreDistributionDto>> GetScoreChartAsync(Guid examId);
		Task<UserCountDto> GetUserCountAsync();
	}
}
