namespace sbms.backend.Modules.Staff.DTOs
{
    public class CreateStaffScheduleRequest
    {
        public Guid StaffId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }

}

