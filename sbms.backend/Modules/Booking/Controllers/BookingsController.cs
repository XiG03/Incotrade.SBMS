using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sbms.backend.Modules.Booking.DTOs;
using sbms.backend.Modules.Booking.Service;

namespace sbms.backend.Modules.Booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingSerivce;
        public BookingsController(IBookingService bookingService)
        {
            _bookingSerivce = bookingService;
        }
        // Mai lam them add accesstoken
        [HttpGet("my-bookings/{id}")]
        public async Task<IActionResult> GetMyBookings([FromRoute] Guid id, [FromQuery] BookingFilterRequest request)
        {
            var response = await _bookingSerivce.GetMyBookingsAsync(id, request);
            return StatusCode(response.statusCode, response);
        }
        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] BookingFilterRequest request)
        {
            var response = await _bookingSerivce.GetAvailableSlotAsync(request);
            return StatusCode(response.statusCode, response);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllBookings([FromQuery] BookingFilterRequest request)
        {
            var response = await _bookingSerivce.GetAllBookingsAsync(request);
            return StatusCode(response.statusCode, response);
        }

    }
}
