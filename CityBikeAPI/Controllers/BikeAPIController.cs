using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityBikeApi.Data;
using CityBikeApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace CityBikeApi.Controllers;

// API controller for CityBike data
[ApiController]
[Route("/api")]
public class BikeAPIController : ControllerBase
{
    private readonly ILogger<BikeAPIController> _logger;
    private readonly AppDbContext _context;

    // constructor with dependency injection for logger and database context
    public BikeAPIController(ILogger<BikeAPIController> logger, AppDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    //GET: /api/stations
    // returns a paginated list of stations, with optional search by name
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
                // no search: return paginated stations
                var data = await query
                    .OrderBy(station => station.Fid) // Default sorting by ID
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
                // search: return all stations whose name contains the search string
                var filteredQuery = query
                    .Where(station => station.Name != null && station.Name.ToLower().Contains(search));
                //.ToListAsync();

                var totalItems = await filteredQuery.CountAsync();

                var data = await filteredQuery
                    .OrderBy(station => station.Fid) // Default sorting by ID
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    currentPage,
                    pageSize,
                    totalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                    data
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching stations");
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    //GET: /api/station/{id}
    // returns detailed information about a single station, including statistics
    [HttpGet("station/{id}")]
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

            // get the number of journeys starting from this station
            //var departureStationCount = await _context.Journeys.CountAsync(j => j.Departure_station_id == data.Id);
            var departureStationCount = await _context.Journeys.CountAsync(j => j.Departure_station_name == data.Name);

            // get the number of journeys ending to this station
            //var returnStationCount = await _context.Journeys.CountAsync(j => j.Return_station_id == data.Id);
            var returnStationCount = await _context.Journeys.CountAsync(j => j.Return_station_name == data.Name);

            // calculate the average distance (in km) for journeys starting from this station
            var avgDepartureDistance = await _context.Journeys
                //.Where(j => j.Departure_station_id == data.Id)
                .Where(j => j.Departure_station_name == data.Name)
                .Select(j => (double?)j.Covered_distance_m)
                .AverageAsync() ?? 0.0;

            // calculate the average distance (in km) for journeys ending to this station
            var avgReturnDistance = await _context.Journeys
                //.Where(j => j.Return_station_id == data.Id)
                .Where(j => j.Return_station_name == data.Name)
                .Select(j => (double?)j.Covered_distance_m)
                .AverageAsync() ?? 0.0;

            // calculate and sort 5 most popular return stations for journeys starting from the station
            var popularReturnStations = await _context.Journeys
                //.Where(j => j.Departure_station_id == data.Id && j.Return_station_name != null)
                .Where(j => j.Departure_station_name == data.Name && j.Return_station_name != null)
                .GroupBy(j => new { j.Return_station_id, j.Return_station_name })
                .Select(g => new
                {
                    ReturnStationId = g.Key.Return_station_id,
                    ReturnStationName = g.Key.Return_station_name,
                    ReturnStationCoordinate = _context.Stations
                        .Where(s => s.Fid == g.Key.Return_station_id)
                        .Select(s => new { s.X, s.Y })
                        .FirstOrDefault(),
                    JourneyCount = g.Count()
                })
                .OrderByDescending(g => g.JourneyCount)
                .Take(5)
                .ToListAsync();

            // calculate and sort 5 most popular departure stations for journeys ending at the station
            var popularDepartureStations = await _context.Journeys
                //.Where(j => j.Return_station_id == data.Id && j.Departure_station_name != null)
                .Where(j => j.Return_station_name == data.Name && j.Departure_station_name != null)
                .GroupBy(j => new { j.Departure_station_id, j.Departure_station_name })
                .Select(g => new
                {
                    DepartureStationId = g.Key.Departure_station_id,
                    DepartureStationName = g.Key.Departure_station_name,
                    DepartureStationCoordinate = _context.Stations
                        .Where(s => s.Fid == g.Key.Departure_station_id)
                        .Select(s => new { s.X, s.Y })
                        .FirstOrDefault(),
                    JourneyCount = g.Count()
                })
                .OrderByDescending(g => g.JourneyCount)
                .Take(5)
                .ToListAsync();

            // returns station info and statistics
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
            _logger.LogError(ex, "Error occurred while fetching station with FID {StationFid}", id);
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    //POST: /api/stations
    // adds a new station to the database
    // roles = "User,Admin" means: token must contain EITHER the User OR Admin role claim
    [Authorize(Roles = "User,Admin")]
    [HttpPost("stations")]
    public async Task<ActionResult<Station>> AddStation([FromBody] Station newStation)
    {
        try
        {
            newStation.Id = _context.Stations.Max(s => s.Id);
            newStation.Id += 1;

            _context.Stations.Add(newStation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStations), new { id = newStation.Id }, newStation);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while adding a new station");
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    // DELETE: /api/stations/{id}
    // deletes a station by ID
    // only users with the Admin role claim in their token can call this
    [Authorize(Roles = "Admin")]
    [HttpDelete("station/{id}")]
    public async Task<IActionResult> DeleteStation(int id)
    {
        try
        {
            var station = await _context.Stations.FindAsync(id);
            if (station == null)
            {
                return NotFound();
            }
            _context.Stations.Remove(station);
            await _context.SaveChangesAsync();
            return Ok("Station deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting station with ID {StationId}", id);
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    //GET: /api/journey/{id}
    // returns detailed information about a single journey
    [HttpGet("station-data/{id}")]
    public async Task<ActionResult<IEnumerable<Station>>> GetStationData(int id)
    {
        try
        {
            IQueryable<Station> query = _context.Stations;
            var data = await _context.Stations.FindAsync(id);

            if (data == null)
            {
                return NotFound();
            }

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching journey");
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    //GET: /api/jorneys
    // returns a paginated list of journeys, with optional search and sorting
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
                query = sortField.ToLower() switch
                {
                    // apply sorting based on the requested field and order
                    "departure_station_id" => sortOrder == "asc"
                            ? query.OrderBy(j => j.Departure_station_id)
                            : query.OrderByDescending(j => j.Departure_station_id),
                    "departure_station_name" => sortOrder == "asc"
                            ? query.OrderBy(j => j.Departure_station_name)
                            : query.OrderByDescending(j => j.Departure_station_name),
                    "return_station_name" => sortOrder == "asc"
                            ? query.OrderBy(j => j.Return_station_name)
                            : query.OrderByDescending(j => j.Return_station_name),
                    "covered_distance_m" => sortOrder == "asc"
                            ? query.OrderBy(j => j.Covered_distance_m)
                            : query.OrderByDescending(j => j.Covered_distance_m),
                    "duration_sec" => sortOrder == "asc"
                            ? query.OrderBy(j => j.Duration_sec)
                            : query.OrderByDescending(j => j.Duration_sec),

                    // default sorting if unknown field
                    _ => query.OrderBy(j => j.Id)
                };

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
                // no search: return paginated journeys
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
                // search: return journeys where departure station name contains the search string
                var filteredQuery = query
                    .Where(journey => journey.Departure_station_name != null &&
                            journey.Departure_station_name.ToLower().Contains(search));

                var totalItems = await filteredQuery.CountAsync();

                var data = await filteredQuery
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    currentPage,
                    pageSize,
                    totalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
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

    //GET: /api/journey/{id}
    // returns detailed information about a single journey
    [HttpGet("journey/{id}")]
    public async Task<ActionResult<IEnumerable<Journey>>> GetJourney(int id)
    {
        try
        {
            IQueryable<Journey> query = _context.Journeys;
            var data = await _context.Journeys.FindAsync(id);

            if (data == null)
            {
                return NotFound();
            }

            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching journey");
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    //POST: /api/journeys
    // adds a new journey to the database
    [Authorize(Roles = "User,Admin")]
    [HttpPost("journeys")]
    public async Task<ActionResult<Journey>> AddJourney([FromBody] Journey newJourney)
    {
        try
        {
            newJourney.Id = _context.Journeys.Max(j => j.Id);
            newJourney.Id += 1;

            _context.Journeys.Add(newJourney);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJourneys), new { id = newJourney.Id }, newJourney);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while adding a new journey");
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }

    // DELETE: /api/journey/{id}
    // deletes a journey by ID
    [Authorize(Roles = "Admin")]
    [HttpDelete("journey/{id}")]
    public async Task<IActionResult> DeleteJourney(int id)
    {
        try
        {
            var journey = await _context.Journeys.FindAsync(id);
            if (journey == null)
            {
                return NotFound();
            }
            _context.Journeys.Remove(journey);
            await _context.SaveChangesAsync();
            return Ok("Journey deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting journey with ID {JourneyId}", id);
            return StatusCode(500, new { error = "An error occurred while processing your request" });
        }
    }
}