using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CityBikeApi.Models;

namespace CityBikeApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Station> Stations { get; set; } = null!;
    public DbSet<Journey> Journeys { get; set; } = null!;
}