using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;

namespace CityBikeApi.Models;

public class Journey
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int Departure_station_id { get; set; }
    public string? Departure_station_name { get; set; }
    public int Return_station_id { get; set; }
    public string? Return_station_name { get; set; }
    public int Covered_distance_m { get; set; }
    public int Duration_sec { get; set; }

    public Journey()
    {
    }
}