using sbms.backend.Helpers;
using sbms.backend.Modules.Services.DTOs;

namespace sbms.backend.Modules.Services.Services
{
    public interface IServiceService
    {
        public Task<APIResponse<ServicesCreateResponse>> CreateServiceAsync(ServicesCreateRequest request);
        public Task<APIResponse<ServicesUpdateResponse>> UpdateServiceAsync(ServicesUpdateRequest request);
        public Task<APIResponse<List<ServicesResponse>>> GetAllServicesAsync();
        public Task<APIResponse<List<ServicesResponse>>> GetActiveServicesAsync();
        public Task<APIResponse<List<ServicesResponse>>> GetInActiveServicesAsync();


    }
}
