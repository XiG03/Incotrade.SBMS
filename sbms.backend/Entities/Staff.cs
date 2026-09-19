namespace sbms.backend.Entities
{
    public class Staff
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public bool IsActive { get; set; }

        public ICollection<WorkSchedule> WorkSchedules { get; set; }
        public ICollection<Booking> Bookings { get; set; }
    }

}

