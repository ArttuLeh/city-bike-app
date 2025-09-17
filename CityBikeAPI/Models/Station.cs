using System.ComponentModel.DataAnnotations;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;

namespace CityBikeAPI.Models;

public class Station
{
    public int? Fid { get; set; }
    [Required]
    public int? Id { get; set; }
    [Required]
    public string? Name { get; set; }
    public string? Address { get; set; }
    public string? Town { get; set; }
    public string? Operator { get; set; }
    public int Capacity { get; set; }
    public double X { get; set; }
    public double Y { get; set; }

    public Station()
    {
    }
}