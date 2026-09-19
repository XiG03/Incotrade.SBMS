using sbms.backend.Helpers;
using sbms.backend.Modules.Auth.DTOs;

namespace sbms.backend.Modules.Auth.Services
{
    public interface IAuthService
    {
        public Task<APIResponse<LoginResponse>> LoginAsync(LoginRequest request);
    }

}

