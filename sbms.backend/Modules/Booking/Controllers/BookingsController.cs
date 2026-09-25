using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using sbms.backend.Modules.Bookings.DTOs;
using sbms.backend.Modules.Bookings.Service;

namespace sbms.backend.Modules.Bookings.Controllers
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
        // Mặc định ai cũng có thể làm được, kể cả admin và customer
        [AllowAnonymous]
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings([FromQuery] BookingFilterRequest request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var id))
            {
                return Unauthorized();
            }
            var response = await _bookingSerivce.GetMyBookingsAsync(id, request);
            return StatusCode(response.statusCode, response);
        }

        [AllowAnonymous]
        [HttpGet("available-slots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] BookingFilterRequest request)
        {
            var response = await _bookingSerivce.GetAvailableSlotAsync(request);
            return StatusCode(response.statusCode, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> BookingsGetAll([FromQuery] BookingFilterRequest request)
        {
            var response = await _bookingSerivce.GetAllBookingsAsync(request);
            return StatusCode(response.statusCode, response);
        }


        [AllowAnonymous]
        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> BookingCancelled([FromRoute] Guid id, [FromBody] BookingCancelRequest request)
        {
            request.bookingId = id;
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var customerId))
            {
                return Unauthorized();
            }
            request.customerId = customerId;
            var response = await _bookingSerivce.BookingCancelAsync(request);
            return StatusCode(response.statusCode, response);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> BookingCreate([FromBody] BookingCreateRequest request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var customerId))
            {
                return Unauthorized();
            }
            request.CustomerId = customerId;
            var response = await _bookingSerivce.BookingCreateAsync(request);
            return StatusCode(response.statusCode, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> BookingUpdateStatus(Guid id, string status)
        {

            // Kiem tra accesstoken thuoc role gi?
            var response = await _bookingSerivce.BookingUpdateStatusAsync(id, status);
            return StatusCode(response.statusCode, response);
        }

    }
}
