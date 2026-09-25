using sbms.backend.Helpers;
using sbms.backend.Modules.Bookings.DTOs;

namespace sbms.backend.Modules.Bookings.Service
{
    public interface IBookingService
    {
        public Task<APIResponse<PagedResponse<List<BookingResponse>>>> GetMyBookingsAsync(Guid userId, BookingFilterRequest request);
        public Task<APIResponse<PagedResponse<List<AvailableSlotResponse>>>> GetAvailableSlotAsync(BookingFilterRequest request);
        public Task<APIResponse<PagedResponse<List<BookingResponse>>>> GetAllBookingsAsync(BookingFilterRequest request);
        public Task<APIResponse<BookingCreateResponse>> BookingCreateAsync (BookingCreateRequest request);
        public Task<APIResponse<BookingUpdateResponse>> BookingUpdateStatusAsync(Guid bookingId, string status);
        public Task<APIResponse<BookingUpdateResponse>> BookingCancelAsync(BookingCancelRequest request);
    }

}

