namespace CityBikeApi.Models;

// DTO for the login request body
public class LoginDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}