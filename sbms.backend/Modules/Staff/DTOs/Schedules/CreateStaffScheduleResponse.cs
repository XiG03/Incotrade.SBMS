namespace sbms.backend.Modules.Staff.DTOs
{
    public class CreateStaffScheduleResponse
    {
        public Guid Id { get; set; }
        public Guid StaffId { get; set; }
        public DateTime WorkDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

}

