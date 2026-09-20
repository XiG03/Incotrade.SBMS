namespace sbms.backend.Entities
{

    public class RefreshToken
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public AppUser AppUser { get; set; }
        public string refreshToken { get; set; }
        public DateTime ExpiryTime { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

    