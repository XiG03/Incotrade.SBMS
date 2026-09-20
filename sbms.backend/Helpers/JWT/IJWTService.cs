namespace sbms.backend.Helpers
{
    public interface IJWTService
    {
        public Task<string> GenerateAccessTokenAsync(string userId, string role);
        public Task<string> GenerateRefreshTokenAsync(string userId);
        
    }

}

