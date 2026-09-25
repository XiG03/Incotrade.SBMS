using Microsoft.Identity.Client;

namespace sbms.backend.Modules.Bookings.DTOs
{
    public class BookingUpdateResponse
    {
        public Guid Id {get; set;}
        public string BookingCode {get; set;}
        public string Status {get; set;}
    }

}

