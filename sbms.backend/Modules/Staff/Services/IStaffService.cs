using sbms.backend.Helpers;
using sbms.backend.Modules.Staff.DTOs;

namespace sbms.backend.Modules.Staff.Service
{
    public interface IStaffService
    {
        public Task<APIResponse<List<StaffsResponse>>> StaffGetAllAsync();
    }

}

