using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sbms.backend.Modules.Staff.DTOs;
using sbms.backend.Modules.Staff.Service;

namespace sbms.backend.Modules.Staff.Controllers
{
    [Route("api/staffs")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;
        public ScheduleController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }
        [HttpGet("{id:guid}/schedules")]
        public async Task<IActionResult> GetStaffWorkSchedules(Guid id)
        {
            var response = await _scheduleService.GetStaffWorkSchedulesAsync(id);

            return StatusCode(response.statusCode, response);
        }
        [HttpPost("{id:guid}/schedules")]
        public async Task<IActionResult> CreateStaffSchedule(Guid id, [FromBody] CreateStaffScheduleRequest request)
        {
            request.StaffId = id;
            var response = await _scheduleService.CreateStaffScheduleAsync(request);
            return StatusCode(response.statusCode, response);
        }
    }
}
