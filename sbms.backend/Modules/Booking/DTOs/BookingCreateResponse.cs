namespace sbms.backend.Modules.Bookings.DTOs
{
    public class BookingCreateResponse
    {
        public Guid Id {get; set;}
        public string BookingCode { get; set; }
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public Guid StaffId { get; set; }
        public DateOnly BookingDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        // public string Status { get; set; }
        public string Status { get; set; }
        public string CustomerNote { get; set; }
    }

}
