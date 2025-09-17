export type Station = {
    id: number;
    fid: number;
    name: string;
    address: string;
    town: string;
    operator: string;
    capacity: number;
    x: number; // longitude
    y: number; // latitude
}