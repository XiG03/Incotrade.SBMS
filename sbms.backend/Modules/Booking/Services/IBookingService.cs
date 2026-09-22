using sbms.backend.Helpers;
using sbms.backend.Modules.Booking.DTOs;

namespace sbms.backend.Modules.Booking.Service
{
    public interface IBookingService
    {
        public Task<APIResponse<PagedResponse<List<BookingResponse>>>> GetMyBookingsAsync(Guid id, BookingFilterRequest request);
        public Task<APIResponse<PagedResponse<List<AvailableSlotResponse>>>> GetAvailableSlotAsync(BookingFilterRequest request);
        public Task<APIResponse<PagedResponse<List<BookingResponse>>>> GetAllBookingsAsync(BookingFilterRequest request);
        public Task<APIResponse<BookingCreateResponse>> BookingCreateAsync (BookingCreateRequest request);
        public Task<APIResponse<BookingUpdateResponse>> BookingUpdateStatusAsync(Guid id, string status);
        public Task<APIResponse<BookingUpdateResponse>> BookingCancelAsync(Guid id);
    }

}

