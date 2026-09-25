namespace sbms.backend.Modules.Bookings.DTOs
{
    public class AvailableSlotResponse
    {
        public Guid StaffId { get; set; }
        public string StaffName { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }

}

