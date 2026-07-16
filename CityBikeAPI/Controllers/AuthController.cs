using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CityBikeApi.Models;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    // POST /api/auth/login
    // accepts { email, password }, returns a JWT token if credentials are valid
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // find the user by email
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // check the password
        var isValidPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isValidPassword)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // get user's roles (a user can have multiple roles)
        var roles = await _userManager.GetRolesAsync(user);

        // build the  JWT "claims", these are data encoded inside the token
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id), // unique ID of the user
            new Claim(ClaimTypes.Email, user.Email!) // user's email
        };

        // add each role as a separate claim — this is what [Authorize(Roles="Admin")] checks
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        // sign the token with your secret key
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["AuthConfiguration:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // create the token
        var token = new JwtSecurityToken(
            issuer: _configuration["AuthConfiguration:Issuer"],
            audience: _configuration["AuthConfiguration:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1), // token valid for 1 hour
            signingCredentials: creds
        );

        return Ok(new
        {
            success = true,
            token = new JwtSecurityTokenHandler().WriteToken(token),
            email = user.Email,
            // send the primary role to the frontend so it can adjust the UI
            role = roles.Contains("Admin") ? "Admin" : "User"
        });
    }
}
