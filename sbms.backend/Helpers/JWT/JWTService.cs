using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using sbms.backend.AppDbContext;
using sbms.backend.Entities;

namespace sbms.backend.Helpers
{
    public class JWTService : IJWTService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public JWTService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<string> GenerateAccessTokenAsync(string userId, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role)
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var tokenDescriptor = new JwtSecurityToken(

            issuer: _configuration.GetValue<string>("Jwt:Issuer"),
            audience: _configuration.GetValue<string>("Jwt:Audience"),
            claims: claims,
            expires: DateTime.Now.AddDays(1), // can be change on 
            signingCredentials: creds
        );
            return await Task.FromResult(new JwtSecurityTokenHandler().WriteToken(tokenDescriptor));

            // throw new NotImplementedException();
        }

        public async Task<string> GenerateRefreshTokenAsync(string userId)
        {

            // Tao refresh token
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                var refreshToken = Convert.ToBase64String(randomNumber);

                var refreshTokenEntity = new RefreshToken
                {
                    UserId = Guid.Parse(userId),
                    refreshToken = refreshToken,
                    ExpiryTime = DateTime.Now.AddDays(7),
                    IsRevoked = false,
                    CreatedAt = DateTime.UtcNow
                };
                _context.RefreshTokens.Add(refreshTokenEntity);
                await _context.SaveChangesAsync();

                return await Task.FromResult(refreshToken);
            }
            throw new NotImplementedException();
        }
    }

}

