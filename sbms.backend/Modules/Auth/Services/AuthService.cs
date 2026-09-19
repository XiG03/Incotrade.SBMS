using Microsoft.EntityFrameworkCore;
using sbms.backend.Helpers;
using sbms.backend.Modules.Auth.DTOs;
using sbms.backend.AppDbContext;

namespace sbms.backend.Modules.Auth.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IJWTService _jwtService;
        public AuthService(ApplicationDbContext context, IJWTService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }
        public async Task<APIResponse<LoginResponse>> LoginAsync(LoginRequest request)
        {
            // Giai thich tieng Viet
            /*
                Luong hoat dong cua Login voi JWT
                1. Nhan request tu client, bao gom username va password
                2. Tai Service, kiem tra username va password voi database
                 2.1. Neu username hoac password khong dung, tra ve APIResponse voi status code 401 (Unauthorized)
                    2.2. Neu username va password dung:
                        2.2.1. Tao RefreshToken va AccessToken (JWT) cho user
                        2.2.2. Luu RefreshToken vao database, dong goi response tra ve cho client, bao gom AccessToken va RefreshToken (RefreshToken co the duoc luu trong cookie)
            */

            // Buoc 1: Kiem tra username va password voi database
            // Password trong truong hop nay khong duoc hash, nen chi can so sanh truc tiep voi database

            var user = await _context.AppUsers
                .FirstOrDefaultAsync(u => 
                u.UserName == request.Username && 
                u.Password == request.Password);
            
            // 1.1 Neu user hoac password khong dung, tra ve APIResponse voi status code 401 (Unauthorized)
            if(user == null)
            {
                return new APIResponse<LoginResponse>
                {
                    statusCode = StatusCodes.Status401Unauthorized,
                    Message = "Invalid username or password",
                    Data = null
                };
            }
            // 1.2 Neu user khong hoat dong, tra ve APIResponse voi status code 403 (Forbidden)
            
            if(!user.IsActive)
            {
                return new APIResponse<LoginResponse>
                {
                    statusCode = StatusCodes.Status403Forbidden,
                    Message = "User is not active",
                    Data = null
                };
            }

            // Buoc 2: Tao RefreshToken va AccessToken (JWT)

            var refreshToken = await _jwtService.GenerateRefreshTokenAsync(user.Id.ToString());
            var accessToken = await _jwtService.GenerateAccessTokenAsync(user.Id.ToString(), user.Role);

            return new APIResponse<LoginResponse>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Login successful",
                Data = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                }
            };
        }
    }
}


