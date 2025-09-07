using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityBikeAPI.Data;
using CityBikeAPI.Models;
using System.Security.Cryptography.X509Certificates;

namespace CityBikeAPI.Controllers;

[ApiController]
[Route("/api")]
public class BikeAPIController : ControllerBase
{
    private readonly ILogger<BikeAPIController> _logger;
    private readonly AppDbContext _context;

    public BikeAPIController(ILogger<BikeAPIController> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    //GET: /api/stations
    [HttpGet("stations")]
    public async Task<ActionResult<IEnumerable<Station>>> GetStations()
    {
        var stations = await _context.Stations.ToListAsync();
        return Ok(stations);
    }

    //GET: /api/station/{id}
    [HttpGet("stations/{id}")]
    public async Task<ActionResult<IEnumerable<Station>>> GetStation(int id)
    {
        var data = await _context.Stations.FindAsync(id);
        if (data == null)
        {
            return NotFound();
        }

        // Get the number of journeys starting from this station
        var departureStationCount = await _context.Journeys.CountAsync(j => j.Departure_station_id == data.Id);

        // Get the number of journeys ending to this station
        var returnStationCount = await _context.Journeys.CountAsync(j => j.Return_station_id == data.Id);

        // Calculate the average distance (in km) for journeys starting from this station
        var avgDepartureDistance = await _context.Journeys
            .Where(j => j.Departure_station_id == data.Id)
            .AverageAsync(j => j.Covered_distance_m);

        // Calculate the average distance (in km) for journeys ending to this station
        var avgReturnDistance = await _context.Journeys
            .Where(j => j.Return_station_id == data.Id)
            .AverageAsync(j => j.Covered_distance_m);

        // calculate and sort 5 most popular return stations for journeys starting from the station
        var popularReturnStations = await _context.Journeys
            .Where(j => j.Departure_station_id == data.Id && j.Return_station_name != null)
            .GroupBy(j => new { j.Return_station_id, j.Return_station_name })
            .Select(g => new
            {
                ReturnStationId = g.Key.Return_station_id,
                ReturnStationName = g.Key.Return_station_name,
                JourneyCount = g.Count()
            })
            .OrderByDescending(g => g.JourneyCount)
            .Take(5)
            .ToListAsync();

        // calculate and sort 5 most popular departure stations for journeys ending at the station
        var popularDepartureStations = await _context.Journeys
            .Where(j => j.Return_station_id == data.Id && j.Departure_station_name != null)
            .GroupBy(j => new { j.Departure_station_id, j.Departure_station_name })
            .Select(g => new
            {
                DepartureStationId = g.Key.Departure_station_id,
                DepartureStationName = g.Key.Departure_station_name,
                JourneyCount = g.Count()
            })
            .OrderByDescending(g => g.JourneyCount)
            .Take(5)
            .ToListAsync();


        return Ok(new
        {
            data.Id,
            data.Name,
            departureStationCount,
            returnStationCount,
            avgDepartureDistance = Math.Round(avgDepartureDistance / 1000.0, 2), // Convert to kilometers
            avgReturnDistance = Math.Round(avgReturnDistance / 1000.0, 2), // Convert to kilometers
            popularReturnStations,
            popularDepartureStations,
        });
    }


    //GET: /api/jorneys
    [HttpGet("journeys")]
    public async Task<ActionResult<IEnumerable<Journey>>> GetJourneys(int page = 1, int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;


        var journeys = await _context.Journeys
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(journeys);
    }

    //GET: /api/journey/{id}
    [HttpGet("journeys/{id}")]
    public async Task<ActionResult<IEnumerable<Journey>>> GetJourney(int id)
    {
        var journey = await _context.Journeys.FindAsync(id);
        if (journey == null)
        {
            return NotFound();
        }
        return Ok(journey);
    }

}
/*var station = await _context.Stations
            .Where(data => data.Id == id)
            .Select(data => new
            {
                data.Id,
                data.Name,
                DepartureStationId = _context.Journeys
                    .Where(j => j.Departure_station_id == id)
                    .ToList(),
                JourneyCount = _context.Journeys.Count(j => j.Departure_station_id == id),
                DepartureStationCount = _context.Journeys.Count(j => j.Departure_station_id == id),
                ReturnStationCount = _context.Journeys.Count(j => j.Return_station_id == id),
                AverageDistance = Math.Round(_context.Journeys
                    .Where(j => j.Departure_station_id == id || j.Return_station_id == id)
                    .Average(j => j.Covered_distance_m) / 1000.0, 2 // Convert to kilometers
            )
            })
            .FirstOrDefaultAsync();

        if (station == null)
        {
            return NotFound();
        }*/