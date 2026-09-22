namespace sbms.backend.Modules.Booking.DTOs
{
    public class PagedResponse<T>
    {
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public int TotalItems { get; set; }
        public T? Data { get; set; }
        
    }

}

