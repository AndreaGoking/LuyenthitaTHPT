using LuyenThiTiengAnh.DTOs.Statistics;
using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IQuestionStatisticsService
	{
		Task<PagedResult<QuestionStatisticsDto>> GetAllAsync(Guid? examId, int page, int pageSize);
		Task<QuestionStatisticsDto> GetByQuestionAsync(Guid questionId);
		Task<IEnumerable<QuestionStatisticsDto>> GetDifficultAsync();
		Task RecalculateForExamAsync(Guid examId);
	}
}
