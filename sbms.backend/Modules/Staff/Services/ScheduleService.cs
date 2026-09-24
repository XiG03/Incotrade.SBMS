using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using sbms.backend.AppDbContext;
using sbms.backend.Entities;
using sbms.backend.Helpers;
using sbms.backend.Modules.Staff.DTOs;

namespace sbms.backend.Modules.Staff.Service
{

    public class ScheduleService : IScheduleService
    {
        private readonly ApplicationDbContext _context;
        public ScheduleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<APIResponse<CreateStaffScheduleResponse>> CreateStaffScheduleAsync(CreateStaffScheduleRequest request)
        {
            // Ý tưởng:
            /*
                Bước 1: Kiểm tra thời gian không được ở quá khứ
                Bước 2: Kiểm tra có Staff (nhân viên) có trong dữ liệu và đang trong trạng thái Active
                Bước 3: Nếu có, kiểm tra thời gian làm có bị trùng không?
                Bước 4: Nếu không trùng, add vào
            
            */
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Neu muon xu ly truong hop 2 request cung 1 luc, su dung co che lock StaffId
                // Bước 1
                var now = DateTime.UtcNow;

                var startDateTime = request.WorkDate.ToDateTime(request.StartTime);

                var endDateTime = request.WorkDate.ToDateTime(request.EndTime);

                if (startDateTime <= now)
                {
                    transaction.RollbackAsync();
                    return new APIResponse<CreateStaffScheduleResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = "Work schedule cannot be in the past.",
                        Data = null
                    };
                }

                if (endDateTime <= startDateTime)
                {
                    transaction.RollbackAsync();
                    return new APIResponse<CreateStaffScheduleResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = "End time must be greater than start time.",
                        Data = null
                    };
                }

                // Bước 2: Kiểm tra nhân viên có trong csdl và trong trạng thái Active

                var staff = await _context.Staffs.AnyAsync(s => s.Id == request.StaffId && s.IsActive == true);
                if (staff == false)
                {
                    transaction.RollbackAsync();
                    return new APIResponse<CreateStaffScheduleResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = $"Staff {request.StaffId} not found or inactive.",
                        Data = null
                    };
                }

                // Bước 3: Nếu có, kiểm tra có ca trùng hay không?

                var conflictSchedule = await _context.WorkSchedules
                            .AnyAsync(ws =>
                                ws.StaffId == request.StaffId &&
                                ws.WorkDate.Date == request.WorkDate.ToDateTime(TimeOnly.MinValue).Date &&
                                ws.EndTime > startDateTime &&
                                ws.StartTime < endDateTime);

                if (conflictSchedule)
                {
                    transaction.RollbackAsync();
                    return new APIResponse<CreateStaffScheduleResponse>
                    {
                        statusCode = StatusCodes.Status409Conflict,
                        Message = "Work schedule conflicts with an existing schedule.",
                        Data = null
                    };
                }

                // Them moi

                var ScheduleId = Guid.NewGuid();

                var schedule = await _context.WorkSchedules.AddAsync(new WorkSchedule
                {
                    Id = ScheduleId,
                    StaffId = request.StaffId,
                    WorkDate = request.WorkDate.ToDateTime(TimeOnly.MinValue),
                    StartTime = request.WorkDate.ToDateTime(request.StartTime),
                    EndTime = request.WorkDate.ToDateTime(request.EndTime)
                });

                var result = await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                if (result == 0)
                {
                    return new APIResponse<CreateStaffScheduleResponse>
                    {
                        statusCode = StatusCodes.Status500InternalServerError,
                        Message = "Failed to create work schedule.",
                        Data = null
                    };
                }
                return new APIResponse<CreateStaffScheduleResponse>
                {
                    statusCode = StatusCodes.Status201Created,
                    Message = "Work schedule created successfully.",
                    Data = new CreateStaffScheduleResponse
                    {
                        Id = ScheduleId,
                        StaffId = request.StaffId,
                        WorkDate = request.WorkDate,
                        StartTime = request.StartTime,
                        EndTime = request.EndTime
                    }
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new APIResponse<CreateStaffScheduleResponse>
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    Message = $"Internal Server Error {ex.Message}",
                    Data = null
                };
            }



            // throw new NotImplementedException();
        }

        public async Task<APIResponse<List<SchedulesResponse>>> GetStaffWorkSchedulesAsync(Guid staffId)
        {
            var schedules = await _context.WorkSchedules
                .Where(ws => ws.StaffId == staffId)
                .Select(ws => new SchedulesResponse
                {
                    Id = ws.Id,
                    StaffId = ws.StaffId,
                    WorkDate = DateOnly.FromDateTime(ws.WorkDate),
                    StartTime = TimeOnly.FromDateTime(ws.StartTime),
                    EndTime = TimeOnly.FromDateTime(ws.EndTime)

                }).ToListAsync();

            if (schedules.Count() == 0)
            {
                return new APIResponse<List<SchedulesResponse>>
                {
                    statusCode = StatusCodes.Status200OK,
                    Message = $"Staff {staffId} doesn't have any work schedules",
                    Data = null
                };
            }

            return new APIResponse<List<SchedulesResponse>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = $"WorkSchedule retrieved Successfully",
                Data = schedules
            };

            // throw new NotImplementedException();
        }
    }
}

