namespace sbms.backend.Modules.Booking.DTOs
{
    public class BookingResponse
    {
        public Guid Id { get; set; }
        public string BookingCode { get; set; }
        public Guid CustomerId { get; set; }
        public Guid ServiceId { get; set; }
        public string serviceName {get; set;}
        public Guid StaffId { get; set; }
        public string staffName {get; set;}
        
        public DateOnly BookingDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public string CustomerNote { get; set; }
        public string CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}

