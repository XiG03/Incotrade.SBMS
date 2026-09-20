using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using sbms.backend.AppDbContext;
using sbms.backend.Helpers;
using sbms.backend.Modules.Staff.DTOs;

namespace sbms.backend.Modules.Staff.Service
{
    public class StaffService : IStaffService
    {
        private readonly ApplicationDbContext _context;
        public StaffService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<APIResponse<List<StaffsResponse>>> StaffGetAllAsync()
        {
            var staffs = await _context.Staffs
                .Select(s => new StaffsResponse
                {
                    Id = s.Id,
                    Fullname = s.FullName,
                    Email = "***@gmail.com",
                    IsActive = s.IsActive
                }).ToListAsync();

            if (staffs.Count == 0)
            {
                return new APIResponse<List<StaffsResponse>>
                {
                    statusCode = StatusCodes.Status200OK,
                    Message = "No staff in database",
                    Data = null
                };
            }
            return new APIResponse<List<StaffsResponse>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Staff retrieved Successfully",
                Data = staffs
            };
            // throw new NotImplementedException();
        }
    }

}

