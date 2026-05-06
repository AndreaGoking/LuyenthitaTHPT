using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.ExamMatrix;

public class SkillDistributionDto
{
	public Guid DistributionId { get; set; }
	public string Skill { get; set; } = null!;
	public int QuestionCount { get; set; }
}

public class ExamMatrixDto
{
	public Guid MatrixId { get; set; }
	public string Name { get; set; } = null!;
	public decimal RecognitionRate { get; set; }
	public decimal UnderstandingRate { get; set; }
	public decimal ApplicationRate { get; set; }
	public decimal HighAppRate { get; set; }
	public int TotalQuestions { get; set; }
	public List<SkillDistributionDto> SkillDistributions { get; set; } = new();
}

public class CreateMatrixRequest
{
	[Required, MaxLength(255)] public string Name { get; set; } = null!;

	[Range(0, 100)] public decimal RecognitionRate { get; set; }
	[Range(0, 100)] public decimal UnderstandingRate { get; set; }
	[Range(0, 100)] public decimal ApplicationRate { get; set; }
	[Range(0, 100)] public decimal HighAppRate { get; set; }

	[Required, MinLength(1)] public List<SkillDistributionRequest> SkillDistributions { get; set; } = new();
}

public class UpdateMatrixRequest
{
	[MaxLength(255)] public string? Name { get; set; }
	[Range(0, 100)] public decimal? RecognitionRate { get; set; }
	[Range(0, 100)] public decimal? UnderstandingRate { get; set; }
	[Range(0, 100)] public decimal? ApplicationRate { get; set; }
	[Range(0, 100)] public decimal? HighAppRate { get; set; }
}

public class SkillDistributionRequest
{
	[Required] public string Skill { get; set; } = null!;
	[Range(1, 1000)] public int QuestionCount { get; set; }
}

public class UpdateSkillDistributionsRequest
{
	[Required, MinLength(1)]
	public List<SkillDistributionRequest> SkillDistributions { get; set; } = new();
}

public class ValidateMatrixResponse
{
	public bool IsValid { get; set; }
	public List<string> Errors { get; set; } = new();
	public int TotalQuestions { get; set; }
	public decimal TotalRate { get; set; }
}