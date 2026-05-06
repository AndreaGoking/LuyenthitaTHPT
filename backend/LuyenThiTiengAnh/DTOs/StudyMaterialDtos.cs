using System.ComponentModel.DataAnnotations;

namespace LuyenThiTiengAnh.DTOs.StudyMaterials;

public class StudyMaterialListDto
{
	public Guid MaterialId { get; set; }
	public string Title { get; set; } = null!;
	public string Topic { get; set; } = null!;
	public string Skill { get; set; } = null!;
	public string CreatedByUsername { get; set; } = null!;
	public DateTime CreatedAt { get; set; }
}

public class StudyMaterialDto : StudyMaterialListDto
{
	public string Content { get; set; } = null!;
}

public class CreateMaterialRequest
{
	[Required, MaxLength(500)] public string Title { get; set; } = null!;
	[Required, MaxLength(255)] public string Topic { get; set; } = null!;
	[Required] public string Content { get; set; } = null!;
	[Required] public string Skill { get; set; } = null!;
}

public class UpdateMaterialRequest
{
	[MaxLength(500)] public string? Title { get; set; }
	[MaxLength(255)] public string? Topic { get; set; }
	public string? Content { get; set; }
	public string? Skill { get; set; }
}

public class MaterialFilterRequest
{
	public string? Skill { get; set; }
	public string? Topic { get; set; }
	public string? Search { get; set; }
	public int Page { get; set; } = 1;
	public int PageSize { get; set; } = 20;
}