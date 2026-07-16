using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CityBikeApi.Data;
using CityBikeApi.Models;

namespace CityBikeApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // add services to the container.
        builder.Services.AddControllers();
        // use InMemory provider when running tests (environment 'Testing')
        if (builder.Environment.IsEnvironment("Testing"))
        {
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("TestDb"));
        }
        else
        {
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("CityBikeDatabase")));
        }

        // identity setup
        // addIdentity registers UserManager<T>, RoleManager<T>, SignInManager<T>
        // as injectable services. These are the tools you use in AuthController.
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
        })
        .AddEntityFrameworkStores<AppDbContext>() // store users in your existing DB
        .AddDefaultTokenProviders();

        // jwt authentication setup
        // read the secret key from appsettings.json
        var jwtKey = builder.Configuration["AuthConfiguration:Key"]!;

        builder.Services.AddAuthentication(options =>
        {
            // tell ASP.NET to use JWT as the default way to authenticate requests
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true, // reject expired tokens
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["AuthConfiguration:Issuer"],
                ValidAudience = builder.Configuration["AuthConfiguration:Audience"],
                // this is how the backend verifies the token hasn't been tampered with
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });

        // enables [Authorize] attributes
        builder.Services.AddAuthorization();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        }));

        // build the app
        var app = builder.Build();

        // authentication must come before Authorization
        app.UseAuthentication(); // <-- reads + validates the JWT token
        app.UseAuthorization(); // <-- checks [Authorize] attributes

        // configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        if (!app.Environment.IsDevelopment())
        {
            app.UseHttpsRedirection();
        }

        app.UseCors("CorsPolicy");

        app.MapControllers();

        // run the app
        app.Run();
    }
}