namespace LuyenThiTiengAnh.DTOs.ExamCodes;

public class ExamQuestionDto
{
	public Guid ExamQuestionId { get; set; }
	public int DisplayOrder { get; set; }
	public Guid QuestionId { get; set; }
	public string Content { get; set; } = null!;
	public string OptionA { get; set; } = null!;
	public string OptionB { get; set; } = null!;
	public string OptionC { get; set; } = null!;
	public string OptionD { get; set; } = null!;
	public string Skill { get; set; } = null!;
	public string Level { get; set; } = null!;
	public Guid? PassageId { get; set; }
}

public class ExamCodeDto
{
	public Guid ExamCodeId { get; set; }
	public string CodeNumber { get; set; } = null!;
	public int Version { get; set; }
	public int QuestionCount { get; set; }
}

public class ExamCodeDetailDto : ExamCodeDto
{
	public List<ExamQuestionDto> Questions { get; set; } = new();
}

public class GenerateCodesRequest
{
	public int Count { get; set; } = 4;
}