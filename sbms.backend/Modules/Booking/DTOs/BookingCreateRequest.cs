using System.Text.Json.Serialization;

namespace sbms.backend.Modules.Bookings.DTOs
{
    public class BookingCreateRequest
    {
        public string BookingCode { get; set; }
        // [JsonIgnore]
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid StaffId { get; set; }
        public DateOnly BookingDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public decimal DurationMinutes { get; set; }

        // public string Status { get; set; }
        public string Status { get; set; }
        public string CustomerNote { get; set; }
    }

}

