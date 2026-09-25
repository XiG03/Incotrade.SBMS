using System.ComponentModel.DataAnnotations;

namespace sbms.backend.Modules.Bookings.DTOs
{
    public class BookingFilterRequest
    {
        // public T? Data {get; set;}
        public DateOnly? FromDate {get; set;} 
        public DateOnly? ToDate{get; set;}
        public string? status {get; set;}

    }

}

