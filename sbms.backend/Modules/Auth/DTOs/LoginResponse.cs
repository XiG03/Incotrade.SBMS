using System.Text.Json.Serialization;

namespace sbms.backend.Modules.Auth.DTOs
{
    public class LoginResponse
    {
        public string AccessToken { get; set; }
        [JsonIgnore]
        public string RefreshToken { get; set; }
    }

}

