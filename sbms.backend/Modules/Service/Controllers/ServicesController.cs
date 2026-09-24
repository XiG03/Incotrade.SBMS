using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sbms.backend.Modules.Services.DTOs;
using sbms.backend.Modules.Services.Services;

namespace sbms.backend.Modules.Services.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;
        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateServiceAsync([FromBody] ServicesCreateRequest request)
        {
            var response = await _serviceService.CreateServiceAsync(request);
            return StatusCode(response.statusCode, response);
        }
        // Note: GET nay la lay tat ca, can them POST lay active va POST lay inactive (Pharse 2)
        // Thieu phan trang
        [HttpGet]
        public async Task<IActionResult> GetAllServicesAsync()
        {
            var response = await _serviceService.GetAllServicesAsync();
            return StatusCode(response.statusCode, response);
        }
        // Active
        [HttpGet("active")]
        public async Task<IActionResult> GetActiveServicesAsync()
        {
            var response = await _serviceService.GetActiveServicesAsync();
            return StatusCode(response.statusCode, response);
        }
        // Active
        [HttpGet("inactive")]
        public async Task<IActionResult> GetInActiveServicesAsync()
        {
            var response = await _serviceService.GetInActiveServicesAsync();
            return StatusCode(response.statusCode, response);
        }

        [HttpPut]
        public async Task<IActionResult> UpadateServiceAsync([FromBody] ServicesUpdateRequest request)
        {
            var response = await _serviceService.UpdateServiceAsync(request);
            return StatusCode(response.statusCode, response);
        }
    }
}
