namespace sbms.backend.Modules.Bookings.DTOs
{
    public class PagedResponse<T>
    {
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public int TotalItems { get; set; }
        public T? Data { get; set; }
        
    }

}

