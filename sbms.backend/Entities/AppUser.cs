namespace sbms.backend.Entities
{
    public class AppUser
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; }
        public string Role { get; set; }
        public ICollection<Customer> Customers { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; }
    }

}

