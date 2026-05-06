using AutoMapper;
using LuyenThiTiengAnh.DTOs.StudyMaterials;
using LuyenThiTiengAnh.DTOs.Users;
using LuyenThiTiengAnh.Models;
using LuyenThiTiengAnh.Models.Enums;
using LuyenThiTiengAnh.Repositories.Interfaces;
using LuyenThiTiengAnh.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LuyenThiTiengAnh.Services.Implementations;

public class StudyMaterialService : IStudyMaterialService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper     _mapper;

    public StudyMaterialService(IUnitOfWork unitOfWork, IMapper mapper)
    {
		_unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedResult<StudyMaterialListDto>> GetAllAsync(MaterialFilterRequest filter)
    {
        var query = _unitOfWork.StudyMaterials.Query()
            .Include(m => m.Creator)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter.Skill) &&
            Enum.TryParse<SkillType>(filter.Skill, true, out var skill))
            query = query.Where(m => m.Skill == skill);

        if (!string.IsNullOrWhiteSpace(filter.Topic))
            query = query.Where(m => m.Topic.Contains(filter.Topic));

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var s = filter.Search.ToLower();
            query = query.Where(m => m.Title.ToLower().Contains(s)
                                  || m.Topic.ToLower().Contains(s));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync();

        return new PagedResult<StudyMaterialListDto>
        {
            Items      = _mapper.Map<List<StudyMaterialListDto>>(items),
            TotalCount = total,
            Page       = filter.Page,
            PageSize   = filter.PageSize
        };
    }

    public async Task<StudyMaterialDto> GetByIdAsync(Guid materialId)
    {
        var m = await _unitOfWork.StudyMaterials.Query()
            .Include(x => x.Creator)
            .FirstOrDefaultAsync(x => x.MaterialId == materialId)
            ?? throw new KeyNotFoundException("Không tìm thấy tài liệu.");

        return _mapper.Map<StudyMaterialDto>(m);
    }

    public async Task<StudyMaterialDto> CreateAsync(Guid teacherId, CreateMaterialRequest request)
    {
        if (!Enum.TryParse<SkillType>(request.Skill, true, out var skill))
            throw new ArgumentException($"Skill không hợp lệ: {request.Skill}");

        var material = new StudyMaterial
        {
            Title     = request.Title,
            Topic     = request.Topic,
            Content   = request.Content,
            Skill     = skill,
            CreatedBy = teacherId
        };

        await _unitOfWork.StudyMaterials.AddAsync(material);
        await _unitOfWork.SaveChangesAsync();
        return await GetByIdAsync(material.MaterialId);
    }

    public async Task<StudyMaterialDto> UpdateAsync(
        Guid materialId, Guid teacherId, UpdateMaterialRequest request)
    {
        var material = await _unitOfWork.StudyMaterials.Query()
            .Include(m => m.Creator)
            .FirstOrDefaultAsync(m => m.MaterialId == materialId)
            ?? throw new KeyNotFoundException("Không tìm thấy tài liệu.");

        if (material.CreatedBy != teacherId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(teacherId);
            if (user?.Role != UserRole.Admin)
                throw new UnauthorizedAccessException("Không có quyền chỉnh sửa tài liệu này.");
        }

        if (request.Title   is not null) material.Title   = request.Title;
        if (request.Topic   is not null) material.Topic   = request.Topic;
        if (request.Content is not null) material.Content = request.Content;
        if (request.Skill is not null &&
            Enum.TryParse<SkillType>(request.Skill, true, out var skill))
            material.Skill = skill;

        _unitOfWork.StudyMaterials.Update(material);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<StudyMaterialDto>(material);
    }

    public async Task DeleteAsync(Guid materialId, Guid teacherId)
    {
        var material = await _unitOfWork.StudyMaterials.GetByIdAsync(materialId)
            ?? throw new KeyNotFoundException("Không tìm thấy tài liệu.");

        if (material.CreatedBy != teacherId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(teacherId);
            if (user?.Role != UserRole.Admin)
                throw new UnauthorizedAccessException("Không có quyền xóa tài liệu này.");
        }

        _unitOfWork.StudyMaterials.Remove(material);
        await _unitOfWork.SaveChangesAsync();
    }
}
