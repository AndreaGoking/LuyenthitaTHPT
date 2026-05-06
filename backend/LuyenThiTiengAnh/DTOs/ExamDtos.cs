using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.Exams;

public class ExamListDto
{
	public Guid ExamId { get; set; }
	public string Title { get; set; } = null!;
	public int DurationMinutes { get; set; }
	public string Status { get; set; } = null!;
	public int TotalCodes { get; set; }
	public DateTime? OpenTime { get; set; }
	public DateTime? CloseTime { get; set; }
	public string CreatedByUsername { get; set; } = null!;
	public DateTime CreatedAt { get; set; }
}

public class ExamDto : ExamListDto
{
	public Guid MatrixId { get; set; }
	public string MatrixName { get; set; } = null!;
	public int ParticipantCount { get; set; }
}

public class CreateExamRequest
{
	[Required, MaxLength(500)] public string Title { get; set; } = null!;
	[Range(1, 300)] public int DurationMinutes { get; set; } = 60;
	[Range(1, 100)] public int TotalCodes { get; set; } = 4;
	public DateTime? OpenTime { get; set; }
	public DateTime? CloseTime { get; set; }
	[Required] public Guid MatrixId { get; set; }
}

public class UpdateExamRequest
{
	[MaxLength(500)] public string? Title { get; set; }
	[Range(1, 300)] public int? DurationMinutes { get; set; }
	[Range(1, 100)] public int? TotalCodes { get; set; }
	public DateTime? OpenTime { get; set; }
	public DateTime? CloseTime { get; set; }
	public Guid? MatrixId { get; set; }
}

public class ScoreDistributionDto
{
	public string ScoreBand { get; set; } = null!;
	public int StudentCount { get; set; }
	public decimal Percentage { get; set; }
}