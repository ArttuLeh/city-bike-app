# CityBikeApp

A full-stack web application for exploring city bike stations and journeys.  
Built with ASP.NET Core Web API (backend) and React + TypeScript (frontend).

---

## Features

- **Browse stations and journeys:** View, search, and paginate city bike stations and journeys.
- **Journey statistics:** See popular departure/return stations and journey counts.
- **Interactive charts:** Visualize station data with MUI X Charts.
- **REST API:** Fast, documented endpoints for all data.
- **Swagger UI:** Explore and test the API at `/swagger`.

---

## Tech Stack

- **Backend:** ASP.NET Core 8, Entity Framework Core, PostgreSQL/SQLite, Swashbuckle (Swagger)
- **Frontend:** React, TypeScript, MUI, Redux Toolkit, MUI X Charts

---

## Getting Started

### Backend (API)

1. **Install dependencies:**
   ```bash
   cd CityBikeAPI
   dotnet restore
   ```

2. **Configure database:**
   - Set your connection string in `appsettings.json`.

3. **Run the API:**
   ```bash
   dotnet run
   ```
   - API runs at `https://localhost:5000`
   - Swagger UI at `https://localhost:5000/swagger`

---

### Frontend (UI)

1. **Install dependencies:**
   ```bash
   cd city-bike-ui
   npm install
   ```

2. **Start the frontend:**
   ```bash
   npm start
   ```
   - Runs at `http://localhost:3000` (or `https://localhost:3000` if using HTTPS)

---

## Development Notes

- **CORS:** The backend allows requests from the frontend origin.
- **Proxy:** The frontend proxies API requests to the backend (`proxy` field in `package.json`).
- **HTTPS:** For secure local development, trust the ASP.NET Core dev certificate:
  ```bash
  dotnet dev-certs https --trust
  ```
