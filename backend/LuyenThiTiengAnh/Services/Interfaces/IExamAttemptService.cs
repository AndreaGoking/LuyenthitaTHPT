using LuyenThiTiengAnh.DTOs.ExamAttempts;
using LuyenThiTiengAnh.DTOs.ExamResults;
using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IExamAttemptService
	{
		Task<AttemptDto> StartAttemptAsync(Guid studentId, StartAttemptRequest request);
		Task<AttemptDto> GetAttemptAsync(Guid attemptId, Guid studentId);
		Task SaveAnswersAsync(Guid attemptId, Guid studentId, SaveAnswersBatchRequest request);
		Task<ExamResultDto> SubmitAsync(Guid attemptId, Guid studentId, bool isAuto = false);
		Task<int> GetRemainingSecondsAsync(Guid attemptId);
		Task<PagedResult<AttemptHistoryDto>> GetHistoryAsync(Guid studentId, int page, int pageSize);
	}
}
