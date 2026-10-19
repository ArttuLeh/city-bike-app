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

- **Backend:** ASP.NET Core 10, Entity Framework Core, PostgreSQL/SQLite, Swashbuckle (Swagger)
- **Frontend:** React, TypeScript, MUI, Redux Toolkit, MUI X Charts

---

## Screenshots

Stations view
<img width="800" height="640" alt="Stations" src="https://github.com/user-attachments/assets/37728369-663e-4b31-8fb9-f4cf2f240f3e" />

Journeys view
<img width="800" height="640" alt="Journeys" src="https://github.com/user-attachments/assets/30606c70-87c4-45c0-9cea-d5e353230612" />

Selected station view
<img width="800" height="640" alt="Station-data" src="https://github.com/user-attachments/assets/c3015ffb-e349-49a2-8951-c7c46ee27346" />
<img width="800" height="640" alt="Station-map" src="https://github.com/user-attachments/assets/7f58eff5-b0bc-46f8-984e-c54270fdd0a6" />

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

   - API runs at `http://localhost:5285`
   - Swagger UI at `https://localhost:5285/swagger`

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
