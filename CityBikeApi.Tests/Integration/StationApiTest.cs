using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using CityBikeApi; // for Program
using CityBikeApi.Data;

namespace CityBikeApi.Tests.Integration
{
    public class StationApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        private readonly CustomWebApplicationFactory<Program> _factory;
        public StationApiTests(CustomWebApplicationFactory<Program> factory)
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
        public async Task GetStations_ReturnsSuccessStatusCode()
        {
            // Arrange
            var request = "/api/stations";

            // Act
            var response = await _client.GetAsync(request);

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            var content = await response.Content.ReadAsStringAsync();
            Assert.NotEmpty(content);
        }

        [Fact]
        public async Task PostStation_CreatesStation_Returns201AndLocation()
        {
            // Arrange
            var payload = new
            {
                fid = 107,
                name = "Tenholantie",
                address = "Tenholantie 1",
                town = "Helsinki",
                oprator = "CityBike Finland",
                capacity = 20,
                x = 24.90,
                y = 60.20
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/stations", payload);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var body = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(body);
            Assert.True(doc.RootElement.TryGetProperty("id", out var idProp));
            Assert.True(idProp.GetInt32() > 0);
            Assert.NotNull(response.Headers.Location);

            // Verify GET by id
            var getResp = await _client.GetAsync($"/api/station-data/{idProp.GetInt32()}");
            getResp.EnsureSuccessStatusCode();
            var getBody = await getResp.Content.ReadAsStringAsync();
            Assert.Contains("fid", getBody);
        }

        [Fact]
        public async Task DeleteStation_RemovesResource_Returns200Then404()
        {
            // Create station first
            var payload = new
            {
                fid = 113,
                name = "Pasilanasema",
                address = "Pasilantie 1",
                town = "Helsinki",
                oprator = "CityBike Finland",
                capacity = 25,
                x = 24.95,
                y = 60.22
            };
            var create = await _client.PostAsJsonAsync("/api/stations", payload);
            create.EnsureSuccessStatusCode();
            var body = await create.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(body);
            var id = doc.RootElement.GetProperty("id").GetInt32();

            // Delete
            var del = await _client.DeleteAsync($"/api/station/{id}");
            del.EnsureSuccessStatusCode();

            // Verify 404 on subsequent GET
            var get = await _client.GetAsync($"/api/station-data/{id}");
            Assert.Equal(HttpStatusCode.NotFound, get.StatusCode);
        }

        [Fact]
        public async Task GetStations_ReturnsPaginatedData()
        {
            var resp = await _client.GetAsync("/api/stations");
            resp.EnsureSuccessStatusCode();
            var body = await resp.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(body);
            Assert.True(doc.RootElement.TryGetProperty("data", out var dataProp));
            Assert.True(dataProp.ValueKind == JsonValueKind.Array);
        }

        [Fact]
        public async Task GetStation_ById_ReturnsStatsAndData()
        {
            // Use seeded station 107
            var resp = await _client.GetAsync("/api/station/107");
            resp.EnsureSuccessStatusCode();
            var body = await resp.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;
            Assert.True(root.TryGetProperty("success", out var successProp) && successProp.GetBoolean());
            Assert.True(root.TryGetProperty("data", out _));
            Assert.True(root.TryGetProperty("departureStationCount", out _));
            Assert.True(root.TryGetProperty("returnStationCount", out _));
            Assert.True(root.TryGetProperty("avgDepartureStationDistance", out _));
            Assert.True(root.TryGetProperty("avgReturnStationDistance", out _));
            Assert.True(root.TryGetProperty("popularReturnStations", out _));
            Assert.True(root.TryGetProperty("popularDepartureStations", out _));
        }
    }
}