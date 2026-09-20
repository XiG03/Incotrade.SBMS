namespace sbms.backend.Modules.Services.DTOs
{
    public class ServicesCreateResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal DurationMinutes { get; set; }
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
    }
}