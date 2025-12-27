using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;

namespace CityBikeApi.Models;

public class Station
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public string? Name { get; set; }
    public int Fid { get; set; }
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