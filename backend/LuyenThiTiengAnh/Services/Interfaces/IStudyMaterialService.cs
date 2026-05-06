using LuyenThiTiengAnh.DTOs.StudyMaterials;
using LuyenThiTiengAnh.DTOs.Users;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IStudyMaterialService
	{
		Task<PagedResult<StudyMaterialListDto>> GetAllAsync(MaterialFilterRequest filter);
		Task<StudyMaterialDto> GetByIdAsync(Guid materialId);
		Task<StudyMaterialDto> CreateAsync(Guid teacherId, CreateMaterialRequest request);
		Task<StudyMaterialDto> UpdateAsync(Guid materialId, Guid teacherId, UpdateMaterialRequest request);
		Task DeleteAsync(Guid materialId, Guid teacherId);
	}
}
