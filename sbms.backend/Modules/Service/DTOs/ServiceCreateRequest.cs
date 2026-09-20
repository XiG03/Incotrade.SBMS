using System.ComponentModel.DataAnnotations;

namespace sbms.backend.Modules.Services.DTOs
{
    public class ServicesCreateRequest
    {
        [Required]
        public string Name {get; set;}
        public string Description {get; set;}
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Duration must be greater than 0.")] // Thoi gian phai lon hon 0
        public decimal DurationMinutes {get; set;}
        [Required]
        [Range(0, double.MaxValue, ErrorMessage ="Price must be greater than 0.")] // Gia khong duoc am
        public decimal Price {get; set;}
    }

}

