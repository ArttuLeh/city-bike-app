using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using CityBikeApi; // for Program
using CityBikeApi.Data;

namespace CityBikeApi.Tests.Integration
{
    public class JourneyApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        private readonly CustomWebApplicationFactory<Program> _factory;
        public JourneyApiTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        private void Seed()
        {
            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            Utilities.ResetDb(db);
            Utilities.InitializeDbForTests(db);
        }

        [Fact]
        public async Task GetJourneys_ReturnsSuccessStatusCode()
        {
            // Arrange
            var request = "/api/journeys";

            // Act
            var response = await _client.GetAsync(request);

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotEmpty(content);
        }

        [Fact]
        public async Task PostJourney_CreatesJourney_Returns201AndLocation()
        {
            // Arrange
            var payload = new
            {
                departure_station_id = 107,
                departure_station_name = "Tenholantie",
                return_station_id = 111,
                return_station_name = "Esterinportti",
                covered_distance_m = 1000,
                duration_sec = 300
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/journeys", payload);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var body = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(body);
            Assert.True(doc.RootElement.TryGetProperty("id", out var idProp));
            Assert.True(idProp.GetInt32() > 0);
            Assert.NotNull(response.Headers.Location);

            // Verify GET by id
            var getResp = await _client.GetAsync($"/api/journey/{idProp.GetInt32()}");
            getResp.EnsureSuccessStatusCode();
            var getBody = await getResp.Content.ReadAsStringAsync();
            Assert.Contains("departure_station_id", getBody);
        }

        [Fact]
        public async Task DeleteJourney_RemovesResource_Returns200Then404()
        {
            // Create journey first
            var payload = new
            {
                departure_station_id = 113,
                departure_station_name = "Pasilanasema",
                return_station_id = 107,
                return_station_name = "Tenholantie",
                covered_distance_m = 1200,
                duration_sec = 360
            };
            var create = await _client.PostAsJsonAsync("/api/journeys", payload);
            create.EnsureSuccessStatusCode();
            var body = await create.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(body);
            var id = doc.RootElement.GetProperty("id").GetInt32();

            // Delete
            var del = await _client.DeleteAsync($"/api/journey/{id}");
            del.EnsureSuccessStatusCode();

            // Verify 404 on subsequent GET
            var get = await _client.GetAsync($"/api/journey/{id}");
            Assert.Equal(HttpStatusCode.NotFound, get.StatusCode);
        }
    }
}