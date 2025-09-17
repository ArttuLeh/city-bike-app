import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        loadComponent: () => import("./pages/home/home").then(c => c.Home)
    },
    {
        path: "journeys",
        loadComponent: () => import("./pages/journeys/journeys").then(c => c.Journeys)
    },
    {
        path: "stations",
        loadComponent: () => import("./pages/stations/stations").then(c => c.Stations)
    },
];
