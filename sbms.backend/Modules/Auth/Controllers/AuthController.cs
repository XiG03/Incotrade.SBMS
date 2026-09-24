using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sbms.backend.Modules.Auth.DTOs;
using sbms.backend.Modules.Auth.Services;

namespace sbms.backend.Modules.Auth.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);
            if(response.Data == null)
            {
                return StatusCode(response.statusCode, response);
            }
            Response.Cookies.Append("refreshToken", response.Data?.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });
            return StatusCode(response.statusCode, response);
        }
    }
}
