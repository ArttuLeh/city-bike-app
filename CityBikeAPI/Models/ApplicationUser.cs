using Microsoft.AspNetCore.Identity;

namespace CityBikeApi.Models;

// extend IdentityUser instead of writing our own user table.
// IdentityUser already has: Id, UserName, Email, PasswordHash, etc.
public class ApplicationUser : IdentityUser
{

}