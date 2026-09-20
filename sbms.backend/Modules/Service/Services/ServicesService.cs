using sbms.backend.Helpers;
using sbms.backend.Modules.Services.DTOs;
using sbms.backend.Entities;
using sbms.backend.AppDbContext;
using Microsoft.EntityFrameworkCore;

namespace sbms.backend.Modules.Services.Services
{
    public class ServiceService : IServiceService
    {
        private readonly ApplicationDbContext _context;
        public ServiceService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<APIResponse<ServicesCreateResponse>> CreateServiceAsync(ServicesCreateRequest request)
        {
            try
            {
                var Service = new Service
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Description = request.Description,
                    DurationMinutes = request.DurationMinutes,
                    Price = request.Price,
                    IsActive = true
                };

                await _context.Services.AddAsync(Service);
                var result = await _context.SaveChangesAsync();

                if (result == 0)
                {
                    return new APIResponse<ServicesCreateResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = "Failed to create service",
                        Data = null
                    };
                }

                return new APIResponse<ServicesCreateResponse>
                {
                    statusCode = StatusCodes.Status201Created,
                    Message = "Service created successfully",
                    Data = new ServicesCreateResponse
                    {
                        Id = Service.Id,
                        Name = Service.Name,
                        Description = Service.Description,
                        DurationMinutes = Service.DurationMinutes,
                        Price = Service.Price,
                        IsActive = Service.IsActive
                    }
                };
            }
            catch (Exception ex)
            {
                return new APIResponse<ServicesCreateResponse>
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    Message = $"An error occurred while creating the service: {ex.Message}",
                    Data = null
                };
            }


        }

        public async Task<APIResponse<List<ServicesResponse>>> GetActiveServicesAsync()
        {
            var services = await _context.Services
                .AsNoTracking()
                .Where(s => s.IsActive == true)
                .Select(s => new ServicesResponse
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    DurationMinutes = (int)s.DurationMinutes,
                    Price = s.Price,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            if(services.Count == 0)
            {
                return new APIResponse<List<ServicesResponse>>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "Services not found",
                    Data = null
                };
            }
            return new APIResponse<List<ServicesResponse>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Services retrieved Successfully",
                Data = services
            };
            // throw new NotImplementedException();
        }

        public async Task<APIResponse<List<ServicesResponse>>> GetInActiveServicesAsync()
        {
        var services = await _context.Services
                .AsNoTracking()
                .Where(s => s.IsActive == false)
                .Select(s => new ServicesResponse
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    DurationMinutes = (int)s.DurationMinutes,
                    Price = s.Price,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            if(services.Count == 0)
            {
                return new APIResponse<List<ServicesResponse>>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "Services not found",
                    Data = null
                };
            }
            return new APIResponse<List<ServicesResponse>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Services retrieved Successfully",
                Data = services
            };
            // throw new NotImplementedException();
        }

        public async Task<APIResponse<List<ServicesResponse>>> GetAllServicesAsync()
        {
            // AsNoTracking duoc them vao nham query nhung khong de EFCore theo doi cac entity -> update 
            var services = await _context.Services
                .AsNoTracking()
                .Select(s => new ServicesResponse
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    DurationMinutes = (int)s.DurationMinutes,
                    Price = s.Price,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            if (services.Count == 0)
            {
                return new APIResponse<List<ServicesResponse>>
                {
                    statusCode = StatusCodes.Status404NotFound,
                    Message = "No services found",
                    Data = null
                };
            }

            return new APIResponse<List<ServicesResponse>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Services retrieved successfully",
                Data = services
            };
        }


        public async Task<APIResponse<ServicesUpdateResponse>> UpdateServiceAsync(ServicesUpdateRequest request)
        {
            var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == request.Id);

            if (service == null)
            {
                return new APIResponse<ServicesUpdateResponse>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "Can not update Services",
                    Data = null
                };
            }

            service.Name = request.Name;
            service.Description = request.Description;
            service.DurationMinutes = request.DurationMinutes;
            service.Price = request.Price;
            service.IsActive = request.IsActive;

            var result = await _context.SaveChangesAsync();
            if (result == 0)
            {
                return new APIResponse<ServicesUpdateResponse>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "Can not update Service",
                    Data = null
                };
            }
            return new APIResponse<ServicesUpdateResponse>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Update service Successfully",
                Data = new ServicesUpdateResponse
                {
                    Id = request.Id,
                    Name = request.Name,
                    Description = request.Description,
                    DurationMinutes = request.DurationMinutes,
                    Price = request.Price,
                    IsActive = request.IsActive
                }
            };
            // throw new NotImplementedException();
        }
    }
}

