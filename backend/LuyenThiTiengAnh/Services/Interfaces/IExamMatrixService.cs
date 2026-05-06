using LuyenThiTiengAnh.DTOs.ExamMatrix;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IExamMatrixService
	{
		Task<IEnumerable<ExamMatrixDto>> GetAllAsync();
		Task<ExamMatrixDto> GetByIdAsync(Guid matrixId);
		Task<ExamMatrixDto> CreateAsync(CreateMatrixRequest request);
		Task<ExamMatrixDto> UpdateAsync(Guid matrixId, UpdateMatrixRequest request);
		Task DeleteAsync(Guid matrixId);
		Task<IEnumerable<SkillDistributionDto>> GetSkillDistributionsAsync(Guid matrixId);
		Task<IEnumerable<SkillDistributionDto>> UpdateSkillDistributionsAsync(Guid matrixId, UpdateSkillDistributionsRequest request);
		Task<ValidateMatrixResponse> ValidateAsync(Guid matrixId);
	}
}
