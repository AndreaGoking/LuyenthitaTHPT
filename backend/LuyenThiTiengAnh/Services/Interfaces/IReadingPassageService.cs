using LuyenThiTiengAnh.DTOs.ReadingPassages;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IReadingPassageService
	{
		Task<IEnumerable<PassageDto>> GetAllAsync();
		Task<PassageDetailDto> GetByIdAsync(Guid passageId);
		Task<PassageDto> CreateAsync(Guid teacherId, CreatePassageRequest request);
		Task<PassageDto> UpdateAsync(Guid passageId, UpdatePassageRequest request);
		Task DeleteAsync(Guid passageId);
		Task AddQuestionAsync(Guid passageId, Guid questionId);
		Task RemoveQuestionAsync(Guid passageId, Guid questionId);
	}
}
