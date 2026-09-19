namespace sbms.backend.Helpers
{
    public class APIResponse<T>
    {
        public int statusCode {get; set;}
        public string? Message {get; set;}
        public T? Data {get; set;}
    }

}

