using LuyenThiTiengAnh.DTOs.Questions;
using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IQuestionService
	{
		Task<PagedResult<QuestionListDto>> GetQuestionsAsync(QuestionFilterRequest filter);
		Task<QuestionDto> GetByIdAsync(Guid questionId);
		Task<QuestionDto> CreateAsync(Guid teacherId, CreateQuestionRequest request);
		Task<QuestionDto> UpdateAsync(Guid questionId, Guid userId, UpdateQuestionRequest request);
		Task DeleteAsync(Guid questionId, Guid userId);
		Task<ImportQuestionsResponse> ImportFromWordAsync(Guid teacherId, Stream fileStream, string fileName);
	}
}
