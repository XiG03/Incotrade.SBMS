using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sbms.backend.AppDbContext;
using sbms.backend.Entities;
using sbms.backend.Helpers;
using sbms.backend.Modules.Booking.DTOs;

namespace sbms.backend.Modules.Booking.Service
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<APIResponse<BookingUpdateResponse>> BookingCancelAsync(Guid id)
        {
            var booking = _context.Bookings
                            .Where(b => b.Id == id)
                            .FirstOrDefault();
            if(booking == null)
            {
                
            }
            throw new NotImplementedException();
        }

        public Task<APIResponse<BookingCreateResponse>> BookingCreateAsync(BookingCreateRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<APIResponse<BookingUpdateResponse>> BookingUpdateStatusAsync(Guid id, string status)
        {
            throw new NotImplementedException();
        }

        public async Task<APIResponse<PagedResponse<List<BookingResponse>>>> GetAllBookingsAsync(BookingFilterRequest request)
        {
            var query = _context.Bookings
                 .AsNoTracking();
            var count = await query.CountAsync();

            if (request.FromDate.HasValue)
            {
                var fromDate = request.FromDate.Value.ToDateTime(TimeOnly.MinValue);
                query = query.Where(b => b.BookingDate.Date >= fromDate);
            }

            if (request.ToDate.HasValue)
            {
                var toDate = request.ToDate.Value.ToDateTime(TimeOnly.MinValue);
                query = query.Where(b => b.BookingDate.Date <= toDate);

            }

            var bookings = await query
                .Select(b => new BookingResponse
                {
                    Id = b.Id,
                    BookingCode = b.BookingCode,
                    CustomerId = b.CustomerId,

                    ServiceId = b.ServiceId,
                    serviceName = b.Service.Name,

                    StaffId = b.StaffId,
                    staffName = b.Staff.FullName,

                    BookingDate = DateOnly.FromDateTime(b.BookingDate),
                    StartTime = TimeOnly.FromDateTime(b.StartTime),
                    EndTime = TimeOnly.FromDateTime(b.EndTime),

                    CustomerNote = b.CustomerNote,
                    CancellationReason = b.CancellationReason,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            if (bookings.Count == 0)
            {
                return new APIResponse<PagedResponse<List<BookingResponse>>>
                {
                    statusCode = StatusCodes.Status200OK,
                    Message = "No bookings found.",
                    Data = new PagedResponse<List<BookingResponse>>
                    {
                        FromDate = request.FromDate.HasValue
                                ? request.FromDate
                                : null,

                        ToDate = request.ToDate.HasValue
                                ? request.ToDate
                                : null,
                        TotalItems = bookings.Count(),
                        Data = null
                    }
                };
            }

            return new APIResponse<PagedResponse<List<BookingResponse>>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Bookings retrieved successfully",
                Data = new PagedResponse<List<BookingResponse>>
                {
                    FromDate = request.FromDate.HasValue
                                ? request.FromDate
                                : null,

                    ToDate = request.ToDate.HasValue
                                ? request.ToDate
                                : null,
                    TotalItems = bookings.Count(),
                    Data = bookings
                }
            };
        }

        public async Task<APIResponse<PagedResponse<List<AvailableSlotResponse>>>> GetAvailableSlotAsync(BookingFilterRequest request)
        {

            // Y tuong lay danh sach ca lam va booking trong khoang thoi gian, sau do loc ca lam theo booking
            var workScheduleQuery = _context.WorkSchedules
                .AsNoTracking()
                .AsQueryable();
            var bookingQuery = _context.Bookings
                .AsNoTracking()
                .Where(b => b.Status != BookingStatus.Cancelled)
                .AsQueryable();

            if (request.FromDate.HasValue)
            {
                var fromDate = request.FromDate.Value.ToDateTime(TimeOnly.MinValue);

                workScheduleQuery = workScheduleQuery
                    .Where(ws => ws.WorkDate.Date >= fromDate);

                bookingQuery = bookingQuery
                    .Where(b => b.BookingDate.Date >= fromDate);
            }

            if (request.ToDate.HasValue)
            {
                var toDate = request.ToDate.Value.ToDateTime(TimeOnly.MinValue);

                workScheduleQuery = workScheduleQuery
                    .Where(ws => ws.WorkDate.Date <= toDate);

                bookingQuery = bookingQuery
                    .Where(b => b.BookingDate.Date <= toDate);
            }

            var schedules = await workScheduleQuery.Select(ws => new
            {
                ws.StaffId,
                ws.Staff.FullName,
                ws.WorkDate,
                ws.StartTime,
                ws.EndTime
            }).ToListAsync();

            var bookings = await bookingQuery.Select(b => new
            {
                b.StaffId,
                b.BookingDate,
                b.StartTime,
                b.EndTime
            }).ToListAsync();

            var result = new List<AvailableSlotResponse>();

            foreach (var schedule in schedules)
            {
                var currentTime = schedule.StartTime.TimeOfDay;

                var staffBookings = bookings.Where(b => b.StaffId == schedule.StaffId
                                                        && b.BookingDate.Date == schedule.WorkDate.Date)
                                            .OrderBy(b => b.StartTime).ToList();
                foreach (var booking in staffBookings)
                {
                    var bookingStart = booking.StartTime.TimeOfDay;
                    var bookingEnd = booking.EndTime.TimeOfDay;

                    if (currentTime < bookingStart)
                    {
                        result.Add(new AvailableSlotResponse
                        {
                            StaffId = schedule.StaffId,
                            StaffName = schedule.FullName,
                            Date = schedule.WorkDate,
                            StartTime = currentTime,
                            EndTime = bookingStart
                        });
                    }

                    if (currentTime < bookingEnd)
                    {
                        currentTime = bookingEnd;
                    }
                }
                if (currentTime < schedule.EndTime.TimeOfDay)
                {
                    result.Add(new AvailableSlotResponse
                    {
                        StaffId = schedule.StaffId,
                        Date = schedule.WorkDate,
                        StartTime = currentTime,
                        EndTime = schedule.EndTime.TimeOfDay
                    });
                }
            }

            if (result.Count == 0)
            {
                return new APIResponse<PagedResponse<List<AvailableSlotResponse>>>
                {
                    statusCode = StatusCodes.Status200OK,
                    Message = "Available slot not found",
                    Data = new PagedResponse<List<AvailableSlotResponse>>
                    {
                        FromDate = request.FromDate.HasValue
                                ? request.FromDate
                                : null,

                        ToDate = request.ToDate.HasValue
                                ? request.ToDate
                                : null,
                        TotalItems = bookings.Count(),
                        Data = null
                    }
                };
            }
            return new APIResponse<PagedResponse<List<AvailableSlotResponse>>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Available slot retrived Successfully",
                Data = new PagedResponse<List<AvailableSlotResponse>>
                {
                    FromDate = request.FromDate.HasValue
                                ? request.FromDate
                                : null,

                    ToDate = request.ToDate.HasValue
                                ? request.ToDate
                                : null,
                    TotalItems = bookings.Count(),
                    Data = result
                }
            };
        }

        public async Task<APIResponse<PagedResponse<List<BookingResponse>>>> GetMyBookingsAsync(Guid id, BookingFilterRequest request)
        {
            var query = _context.Bookings
                 .Where(b => b.CustomerId == id)
                 .AsNoTracking();
            var count = await query.CountAsync();

            if (request.FromDate.HasValue)
            {
                var fromDate = request.FromDate.Value.ToDateTime(TimeOnly.MinValue);
                query = query.Where(b => b.BookingDate.Date >= fromDate);
            }

            if (request.ToDate.HasValue)
            {
                var toDate = request.ToDate.Value.ToDateTime(TimeOnly.MinValue);
                query = query.Where(b => b.BookingDate.Date <= toDate);

            }

            var bookings = await query
                .Select(b => new BookingResponse
                {
                    Id = b.Id,
                    BookingCode = b.BookingCode,
                    CustomerId = b.CustomerId,

                    ServiceId = b.ServiceId,
                    serviceName = b.Service.Name,

                    StaffId = b.StaffId,
                    staffName = b.Staff.FullName,

                    BookingDate = DateOnly.FromDateTime(b.BookingDate),
                    StartTime = TimeOnly.FromDateTime(b.StartTime),
                    EndTime = TimeOnly.FromDateTime(b.EndTime),

                    CustomerNote = b.CustomerNote,
                    CancellationReason = b.CancellationReason,
                    CreatedAt = b.CreatedAt
                })
                .ToListAsync();

            if (bookings.Count == 0)
            {
                return new APIResponse<PagedResponse<List<BookingResponse>>>
                {
                    statusCode = StatusCodes.Status200OK,
                    Message = "No bookings found.",
                    Data = new PagedResponse<List<BookingResponse>>
                    {
                        FromDate = request.FromDate.HasValue
                                ? request.FromDate
                                : null,

                        ToDate = request.ToDate.HasValue
                                ? request.ToDate
                                : null,
                        TotalItems = bookings.Count(),
                        Data = null
                    }
                };
            }

            return new APIResponse<PagedResponse<List<BookingResponse>>>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Bookings retrieved successfully",
                Data = new PagedResponse<List<BookingResponse>>
                {
                    FromDate = request.FromDate.HasValue
                                ? request.FromDate
                                : null,

                    ToDate = request.ToDate.HasValue
                                ? request.ToDate
                                : null,
                    TotalItems = bookings.Count(),
                    Data = bookings
                }
            };


            // throw new NotImplementedException();
        }
    }

}
