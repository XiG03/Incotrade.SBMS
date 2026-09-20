namespace sbms.backend.Modules.Staff.DTOs
{
    public class CreateStaffScheduleRequest
    {
        public Guid StaffId { get; set; }
        public DateTime WorkDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }

}

