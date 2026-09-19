namespace sbms.backend.Entities
{
    public class Booking
    {
        public Guid Id { get; set; }
        public string BookingCode { get; set; }
        public Guid CustomerId { get; set; }
        public Customer Customer { get; set; }
        public Guid ServiceId { get; set; }
        public Service Service { get; set; }
        public Guid StaffId { get; set; }
        public Staff Staff { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        // public string Status { get; set; }
        public string Status { get; set; } = BookingStatus.Pending;
        public string CustomerNote { get; set; }
        public string CancellationReason { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    public static class BookingStatus
    {
        public const string Pending = "Pending";
        public const string Confirmed = "Confirmed";
        public const string Completed = "Completed";
        public const string Cancelled = "Cancelled";
    }
}

