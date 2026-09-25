using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sbms.backend.Modules.Staff.Service;

namespace sbms.backend.Modules.Staff.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly IStaffService _staffServices;
        public StaffController(IStaffService staffServices)
        {
            _staffServices = staffServices;
        }

        // [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> StaffGetAll()
        {
            var response = await _staffServices.StaffGetAllAsync();
            return StatusCode(response.statusCode, response);
        }
    }
}

