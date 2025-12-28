using System.Linq;
using CityBikeApi.Data;
using CityBikeApi.Models;

namespace CityBikeApi.Tests.Integration
{
    public static class Utilities
    {
        public static void InitializeDbForTests(AppDbContext db)
        {
            // Seed Stations
            if (!db.Stations.Any())
            {
                db.Stations.AddRange(
                    new Station { Id = 107, Name = "Tenholantie", Capacity = 20, X = 24.90, Y = 60.20 },
                    new Station { Id = 111, Name = "Esterinportti", Capacity = 18, X = 24.91, Y = 60.21 },
                    new Station { Id = 9, Name = "Erottajanaukio", Capacity = 25, X = 24.94, Y = 60.17 },
                    new Station { Id = 40, Name = "Hakaniemenaukio (M)", Capacity = 22, X = 24.96, Y = 60.18 },
                    new Station { Id = 113, Name = "Pasilanasema", Capacity = 30, X = 24.93, Y = 60.21 }
                );
            }

            // Seed Journeys
            if (!db.Journeys.Any())
            {
                db.Journeys.AddRange(
                    new Journey { Departure_station_id = 107, Departure_station_name = "Tenholantie", Return_station_id = 111, Return_station_name = "Esterinportti", Covered_distance_m = 1847, Duration_sec = 407 },
                    new Journey { Departure_station_id = 111, Departure_station_name = "Esterinportti", Return_station_id = 107, Return_station_name = "Tenholantie", Covered_distance_m = 1847, Duration_sec = 407 },
                    new Journey { Departure_station_id = 9, Departure_station_name = "Erottajanaukio", Return_station_id = 40, Return_station_name = "Hakaniemenaukio (M)", Covered_distance_m = 1602, Duration_sec = 405 },
                    new Journey { Departure_station_id = 40, Departure_station_name = "Hakaniemenaukio (M)", Return_station_id = 9, Return_station_name = "Erottajanaukio", Covered_distance_m = 1602, Duration_sec = 405 },
                    new Journey { Departure_station_id = 113, Departure_station_name = "Pasilanasema", Return_station_id = 107, Return_station_name = "Tenholantie", Covered_distance_m = 2277, Duration_sec = 502 },
                    new Journey { Departure_station_id = 107, Departure_station_name = "Tenholantie", Return_station_id = 113, Return_station_name = "Pasilanasema", Covered_distance_m = 2277, Duration_sec = 502 }
                );
            }

            db.SaveChanges();
        }

        public static void ResetDb(AppDbContext db)
        {
            db.Journeys.RemoveRange(db.Journeys);
            db.Stations.RemoveRange(db.Stations);
            db.SaveChanges();
        }
    }
}