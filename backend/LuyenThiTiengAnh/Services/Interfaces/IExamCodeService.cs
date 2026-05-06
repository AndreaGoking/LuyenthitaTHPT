using LuyenThiTiengAnh.DTOs.ExamCodes;

namespace LuyenThiTiengAnh.Services.Interfaces
{
	public interface IExamCodeService
	{
		Task<IEnumerable<ExamCodeDto>> GetByExamAsync(Guid examId);
		Task<ExamCodeDetailDto> GetDetailAsync(Guid examId, Guid codeId);
		Task<IEnumerable<ExamCodeDto>> GenerateCodesAsync(Guid examId, int count);
		Task<ExamCodeDto> ShuffleAsync(Guid examId, Guid codeId);
		Task DeleteAsync(Guid examId, Guid codeId);
		Task<byte[]> ExportToWordAsync(Guid examId, Guid codeId);
		Task<byte[]> ExportToPdfAsync(Guid examId, Guid codeId);
	}
}
