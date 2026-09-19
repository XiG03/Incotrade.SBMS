namespace sbms.backend.Entities
{
    public class AppUser
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public bool IsActive { get; set; }
        public string Role { get; set; }
        public ICollection<Customer> Customers { get; set; }
    }

}

