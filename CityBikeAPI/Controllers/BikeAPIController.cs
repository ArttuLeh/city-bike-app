using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityBikeAPI.Data;
using CityBikeAPI.Models;

namespace CityBikeAPI.Controllers;

// API controller for CityBike data
[ApiController]
[Route("/api")]
public class BikeAPIController : ControllerBase
{
    private readonly ILogger<BikeAPIController> _logger;
    private readonly AppDbContext _context;

    // Constructor with dependency injection for logger and database context
    public BikeAPIController(ILogger<BikeAPIController> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    //GET: /api/stations
    // Returns a paginated list of stations, with optional search by name
    [HttpGet("stations")]
    public async Task<ActionResult<IEnumerable<Station>>> GetStations(int? page, string search = "")
    {
        try
        {
            int pageSize = 40;
            int currentPage = page ?? 1;
            if (pageSize < 40) pageSize = 40;

            IQueryable<Station> query = _context.Stations;

            search = search.ToLower();

            var totalCount = await query.CountAsync();

            if (string.IsNullOrEmpty(search))
            {
                // No search: return paginated stations
                var data = await query
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    currentPage,
                    pageSize,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    data
                });
            }
            else
            {
                // Search: return all stations whose name contains the search string
                var data = await query
                .Where(station => station.Name != null && station.Name.ToLower().Contains(search))
                .ToListAsync();

                return Ok(new { data });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching stations");
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    //GET: /api/station/{id}
    // Returns detailed information about a single station, including statistics
    [HttpGet("stations/{id}")]
    public async Task<ActionResult<IEnumerable<Station>>> GetStation(int id)
    {
        try
        {
            IQueryable<Station> query = _context.Stations;
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

            // Return station info and statistics
            return Ok(new
            {
                success = true,
                data,
                departureStationCount,
                returnStationCount,
                avgDepartureStationDistance = Math.Round(avgDepartureDistance / 1000.0, 2), // Convert to kilometers
                avgReturnStationDistance = Math.Round(avgReturnDistance / 1000.0, 2), // Convert to kilometers
                popularReturnStations,
                popularDepartureStations,
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching station with ID {StationId}", id);
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }


    //GET: /api/jorneys
    // Returns a paginated list of journeys, with optional search and sorting
    [HttpGet("journeys")]
    public async Task<ActionResult<IEnumerable<Journey>>> GetJourneys(
        int? page, string search = "", string sortField = "", string sortOrder = "")
    {
        try
        {
            int pageSize = 40;
            int currentPage = page ?? 1;
            if (pageSize < 40) pageSize = 40;

            IQueryable<Journey> query = _context.Journeys;

            search = search.ToLower();

            var totalCount = await query.CountAsync();

            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField.ToLower())
                {
                    // Apply sorting based on the requested field and order
                    case "departure_station_id":
                        query = sortOrder == "asc"
                            ? query.OrderBy(j => j.Departure_station_id)
                            : query.OrderByDescending(j => j.Departure_station_id);
                        break;
                    case "departure_station_name":
                        query = sortOrder == "asc"
                            ? query.OrderBy(j => j.Departure_station_name)
                            : query.OrderByDescending(j => j.Departure_station_name);
                        break;
                    case "return_station_name":
                        query = sortOrder == "asc"
                            ? query.OrderBy(j => j.Return_station_name)
                            : query.OrderByDescending(j => j.Return_station_name);
                        break;
                    case "covered_distance_m":
                        query = sortOrder == "asc"
                            ? query.OrderBy(j => j.Covered_distance_m)
                            : query.OrderByDescending(j => j.Covered_distance_m);
                        break;
                    case "duration_sec":
                        query = sortOrder == "asc"
                            ? query.OrderBy(j => j.Duration_sec)
                            : query.OrderByDescending(j => j.Duration_sec);
                        break;
                    default:
                        // Default sorting if unknown field
                        query = query.OrderBy(j => j.Id);
                        break;
                }

                var data = await query
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    currentPage,
                    pageSize,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    data
                });
            }
            else if (string.IsNullOrEmpty(search))
            {
                // No search: return paginated journeys
                var data = await query
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    currentPage,
                    pageSize,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    data
                });
            }
            else
            {
                // Search: return journeys where departure station name contains the search string
                var data = await query
                    .Where(
                        journey => journey.Departure_station_name != null &&
                        journey.Departure_station_name.ToLower().Contains(search))
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    currentPage,
                    pageSize,
                    totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                    data
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching journeys");
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }
}
