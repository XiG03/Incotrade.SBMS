using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using sbms.backend.AppDbContext;
using sbms.backend.Entities;
using sbms.backend.Helpers;
using sbms.backend.Modules.Bookings.DTOs;

namespace sbms.backend.Modules.Bookings.Service
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        public BookingService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<APIResponse<BookingUpdateResponse>> BookingCancelAsync(BookingCancelRequest request)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == request.bookingId);

            if (booking == null)
            {
                return new APIResponse<BookingUpdateResponse>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "Booking isn't exsits",
                    Data = null
                };
            }

            if (booking.CustomerId != request.customerId)
            {
                return new APIResponse<BookingUpdateResponse>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "You do not have permission to update this booking.",
                    Data = null
                };
            }

            if (booking.Status == BookingStatus.Confirmed || booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled)
            {
                return new APIResponse<BookingUpdateResponse>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "This booking cannot be updated because it has already been confirmed, completed or cancelled.",
                    Data = null
                };
            }

            booking.Status = BookingStatus.Cancelled;
            booking.CancellationReason = request.CancellationReason;
            var result = await _context.SaveChangesAsync();
            if (result == 0)
            {
                return new APIResponse<BookingUpdateResponse>
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    Message = "Failed to cancel the booking.",
                    Data = null
                };
            }

            return new APIResponse<BookingUpdateResponse>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Booking cancelled successfully.",
                Data = new BookingUpdateResponse
                {
                    Id = booking.Id,
                    BookingCode = booking.BookingCode,
                    Status = booking.Status
                }
            };
            // throw new NotImplementedException();
        }

        public async Task<APIResponse<BookingCreateResponse>> BookingCreateAsync(BookingCreateRequest request)
        {

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var now = DateTime.UtcNow;

                var startDateTime = request.BookingDate.ToDateTime(request.StartTime);

                var endDateTime = startDateTime.AddMinutes((double)request.DurationMinutes);

                if (startDateTime <= now)
                {
                    await transaction.RollbackAsync();
                    return new APIResponse<BookingCreateResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = "Booking cannot be in the past.",
                        Data = null
                    };
                }

                if (endDateTime <= startDateTime)
                {
                    await transaction.RollbackAsync();
                    return new APIResponse<BookingCreateResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = "End time must be greater than start time.",
                        Data = null
                    };
                }

                // Gia su tai khoan nguoi dung luon luon active

                var staffActive = await _context.Staffs.AnyAsync(s => s.Id == request.StaffId && s.IsActive == true);

                if (staffActive == false)
                {
                    await transaction.RollbackAsync();
                    return new APIResponse<BookingCreateResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = $"Staff {request.StaffId} not found or inactive.",
                        Data = null
                    };
                }

                var isWithinWorkSchedule = await _context.WorkSchedules.AnyAsync(schedule =>
                        schedule.StaffId == request.StaffId &&
                        schedule.WorkDate.Date == request.BookingDate.ToDateTime(TimeOnly.MinValue).Date &&
                        schedule.StartTime <= startDateTime &&
                        schedule.EndTime >= endDateTime);

                if (!isWithinWorkSchedule)
                {
                    await transaction.RollbackAsync();
                    return new APIResponse<BookingCreateResponse>
                    {
                        statusCode = StatusCodes.Status400BadRequest,
                        Message = "Booking is outside staff working hours.",
                        Data = null
                    };
                }

                var bookingConflict = await _context.Bookings
                                        .AnyAsync(b =>
                                            b.StaffId == request.StaffId &&
                                            b.StartTime < endDateTime &&
                                            b.EndTime > startDateTime &&
                                            b.Status != BookingStatus.Cancelled);

                if (bookingConflict)
                {
                    await transaction.RollbackAsync();
                    return new APIResponse<BookingCreateResponse>
                    {
                        statusCode = StatusCodes.Status409Conflict,
                        Message = "Work schedule conflicts with an existing schedule.",
                        Data = null
                    };
                }


                var BookingId = Guid.NewGuid();

                var booking = await _context.Bookings.AddAsync(new Booking
                {
                    Id = BookingId,
                    CustomerId = request.CustomerId,
                    BookingCode = request.BookingCode,
                    ServiceId = request.ServiceId,
                    StaffId = request.StaffId,
                    BookingDate = request.BookingDate.ToDateTime(TimeOnly.MinValue),
                    StartTime = startDateTime,
                    EndTime = endDateTime,
                    CreatedAt = DateTime.UtcNow

                });

                var result = await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                if (result == 0)
                {
                    return new APIResponse<BookingCreateResponse>
                    {
                        statusCode = StatusCodes.Status500InternalServerError,
                        Message = "Failed to create work schedule.",
                        Data = null
                    };
                }
                return new APIResponse<BookingCreateResponse>
                {
                    statusCode = StatusCodes.Status201Created,
                    Message = "Work schedule created successfully.",
                    Data = new BookingCreateResponse
                    {
                        Id = BookingId,
                        StaffId = request.StaffId,
                        BookingDate = request.BookingDate,
                        StartTime = TimeOnly.FromDateTime(startDateTime),
                        EndTime = TimeOnly.FromDateTime(endDateTime)
                    }
                };

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new APIResponse<BookingCreateResponse>
                {
                    statusCode = StatusCodes.Status500InternalServerError,
                    Message = $"Internal Server Error {ex.Message} Inner: {ex.InnerException?.Message}",
                    Data = null
                };
            }
            // throw new NotImplementedException();
        }

        // chi co admin update 
        public async Task<APIResponse<BookingUpdateResponse>> BookingUpdateStatusAsync(Guid bookingId, string status)
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
            {
                return new APIResponse<BookingUpdateResponse>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = "Booking is not exists",
                    Data = null
                };
            }

            if (!BookingStatus.IsValid(status))
            {
                return new APIResponse<BookingUpdateResponse>
                {
                    statusCode = StatusCodes.Status400BadRequest,
                    Message = $"Invalid booking status: {status}",
                    Data = null
                };
            }

            booking.Status = status;
            await _context.SaveChangesAsync();

            var response = new BookingUpdateResponse
            {
                Id = booking.Id,
                BookingCode = booking.BookingCode,
                Status = booking.Status
            };

            return new APIResponse<BookingUpdateResponse>
            {
                statusCode = StatusCodes.Status200OK,
                Message = "Booking status updated successfully",
                Data = response
            };
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
                    status = b.Status,

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
                    .Where(b => b.WorkDate.Date >= fromDate);

                bookingQuery = bookingQuery
                    .Where(b => b.BookingDate.Date >= fromDate);
            }

            if (request.ToDate.HasValue)
            {
                var toDate = request.ToDate.Value.ToDateTime(TimeOnly.MinValue);

                workScheduleQuery = workScheduleQuery
                    .Where(b => b.WorkDate.Date <= toDate);

                bookingQuery = bookingQuery
                    .Where(b => b.BookingDate.Date <= toDate);
            }

            var schedules = await workScheduleQuery.Select(b => new
            {
                b.StaffId,
                b.Staff.FullName,
                b.WorkDate,
                b.StartTime,
                b.EndTime
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

                    if (currentTime <= bookingStart)
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
                    statusCode = StatusCodes.Status404NotFound,
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

        public async Task<APIResponse<PagedResponse<List<BookingResponse>>>> GetMyBookingsAsync(Guid userId, BookingFilterRequest request)
        {
            var query = _context.Bookings
                 .Where(b => b.CustomerId == userId)
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
                    status = b.Status,

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
