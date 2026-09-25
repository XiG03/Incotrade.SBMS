using sbms.backend.Helpers;
using sbms.backend.Modules.Staff.DTOs;

namespace sbms.backend.Modules.Staff.Service
{
    public interface IScheduleService
    {
        public Task<APIResponse<List<SchedulesResponse>>> GetStaffWorkSchedulesAsync(Guid staffId);
        public Task<APIResponse<CreateStaffScheduleResponse>> CreateStaffScheduleAsync(CreateStaffScheduleRequest request);
        
    }

}

