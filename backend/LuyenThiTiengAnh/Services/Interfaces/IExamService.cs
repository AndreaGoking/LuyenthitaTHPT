using LuyenThiTiengAnh.DTOs.Exams;
using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IExamService
	{
		Task<PagedResult<ExamListDto>> GetExamsAsync(string? status, int page, int pageSize);
		Task<ExamDto> GetByIdAsync(Guid examId);
		Task<ExamDto> CreateAsync(Guid teacherId, CreateExamRequest request);
		Task<ExamDto> UpdateAsync(Guid examId, UpdateExamRequest request);
		Task DeleteAsync(Guid examId);
		Task ActivateAsync(Guid examId);
		Task DeactivateAsync(Guid examId);
		Task<List<ScoreDistributionDto>> GetScoreDistributionAsync(Guid examId);
	}
}
