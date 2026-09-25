namespace sbms.backend.Modules.Bookings.DTOs
{
    public class BookingCancelRequest
    {
        public Guid customerId { get; set; }
        public Guid bookingId {get; set;}
        public string CancellationReason { get; set; }
    }

}

