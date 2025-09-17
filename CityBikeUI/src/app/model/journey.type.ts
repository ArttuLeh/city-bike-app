export type Journey = {
    id: number;
    departure_station_id: number;
    departure_station_name: string;
    return_station_id: number;
    return_station_name: string;
    covered_distance_m: number; // in meters
    duration_sec: number; // in seconds
}