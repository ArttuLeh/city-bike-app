export interface Station {
    id: string;
    FID: number;
    name: string;
    address: string;
    town: string;
    operator: string;
    capacity: number;
    x: number;
    y: number;
}

export interface Journey {
    id: number;
    departure_station_id: number;
    departure_station_name: string;
    return_station_id: number;
    return_station_name: string;
    covered_distance_m: number;
    duration_sec: number;
}

export interface StationsResponse {
    success: boolean;
    data: Station[];
    totalPages: number;
    currentPage: number;
}

export interface JourneysResponse {
    success: boolean;
    data: Journey[];
    totalPages: number;
    currentPage: number;
}

export interface StationDetails {
    success: boolean;
    data: Station;
    departureStationCount: number;
    returnStationCount: number;
    avgDepartureStationDistance: number;
    avgReturnStationDistance: number;
    popularDepartureStations: {
        departureStationId: number;
        departureStationName: string;
        journeyCount: number;
    }[];
    popularReturnStations: {
        returnStationId: number;
        returnStationName: string;
        journeyCount: number;
    }[];
}

export type JourneyFormValues = Omit<Journey, 'id'>;
export type StationFormValues = Omit<Station, 'id'>;