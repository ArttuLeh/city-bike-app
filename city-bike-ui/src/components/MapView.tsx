import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import L from 'leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import { initializeStations } from '../reducers/stationsReducer';
import { AppDispatch, RootState } from '../store';
import { Station } from '../types';

// Fix default marker icon issue with webpack/react-scripts
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Type for popular departure station data from the API
interface PopularDepartureStation {
  departureStationId: number;
  departureStationName: string;
  departureStationCoordinate: { x: number; y: number };
  journeyCount: number;
}

// Type for popular return station data from the API
interface PopularReturnStation {
  returnStationId: number;
  returnStationName: string;
  returnStationCoordinate: { x: number; y: number };
  journeyCount: number;
}

// Type for a connected station displayed on the map with a polyline
interface ConnectedStation {
  name: string;
  position: [number, number];
  journeyCount: number;
  type: 'departure' | 'return';
}

// Props: when station is provided, shows single station view with journey lines;
// otherwise shows all stations from the store
interface Props {
  station?: Station;
  popularDepartureStations?: PopularDepartureStation[];
  popularReturnStations?: PopularReturnStation[];
}

// Helper component to recenter the map when station changes
const RecenterMap = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  const [x, y] = center;
  useEffect(() => {
    map.setView([x, y], zoom);
  }, [map, x, y, zoom]);
  return null;
};

const MapView = ({
  station,
  popularDepartureStations,
  popularReturnStations,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const stations = useSelector(({ stations }: RootState) => stations);
  const isLoading = useSelector(({ loading }: RootState) => loading);

  // Track which connected station is selected/highlighted on the map
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const isSingleStation = !!station;

  // Fetch all stations only when showing the full map (no single station passed)
  useEffect(() => {
    if (!isSingleStation) {
      dispatch(initializeStations(1, ''));
    }
  }, [dispatch, isSingleStation]);

  // Build the list of connected stations from popular departure/return data
  const connectedStations: ConnectedStation[] = [];

  // Add popular departure stations (journeys ending at the current station)
  if (isSingleStation && popularDepartureStations) {
    popularDepartureStations.forEach((station) => {
      if (station.departureStationCoordinate) {
        connectedStations.push({
          name: station.departureStationName,
          position: [
            station.departureStationCoordinate.y,
            station.departureStationCoordinate.x,
          ],
          journeyCount: station.journeyCount,
          type: 'departure',
        });
      }
    });
  }

  // Add popular return stations (journeys starting from the current station)
  if (isSingleStation && popularReturnStations) {
    popularReturnStations.forEach((station) => {
      if (station.returnStationCoordinate) {
        connectedStations.push({
          name: station.returnStationName,
          position: [
            station.returnStationCoordinate.y,
            station.returnStationCoordinate.x,
          ],
          journeyCount: station.journeyCount,
          type: 'return',
        });
      }
    });
  }

  // Center map on the single station or default to Helsinki center
  const center: [number, number] = isSingleStation
    ? [station.y, station.x]
    : [60.1699, 24.9384];

  // Zoom in closer for single station view
  const zoom = isSingleStation ? 13 : 12;

  // Show only the current station or all stations from the store
  const markersToShow = isSingleStation ? [station] : (stations?.data ?? []);

  // Position used as the origin point for journey polylines
  const stationPosition: [number, number] | null = isSingleStation
    ? [station.y, station.x]
    : null;

  return (
    <div>
      {/* Show heading only on the full map page */}
      {!isSingleStation && <h2>Station Map</h2>}
      {/* Legend for journey line colors in single station view */}
      {isSingleStation && connectedStations.length > 0 && (
        <Box display="flex" gap={3} my={1}>
          <Typography variant="body2">
            <span style={{ color: '#1976d2', fontWeight: 'bold' }}>——</span>{' '}
            Departure stations for journeys ending at the {station.name}
          </Typography>
          <Typography variant="body2">
            <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>——</span>{' '}
            Return stations for journeys starting from {station.name}
          </Typography>
        </Box>
      )}
      {/* Loading spinner for full map view */}
      {isLoading && !isSingleStation && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {/* Layout: map with station lists side by side in single station view */}
      <Box
        display="flex"
        gap={2}
        flexDirection={isSingleStation ? 'row' : 'column'}
      >
        <Box flex={1} minWidth={0}>
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '70vh', width: '100%' }}
          >
            <RecenterMap center={center} zoom={zoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Station markers — single station or all stations */}
            {markersToShow.map((station) => (
              <Marker key={station.id} position={[station.y, station.x]}>
                <Popup>
                  <strong>{station.name}</strong>
                  <br />
                  {station.address}
                  <br />
                  Capacity: {station.capacity}
                </Popup>
              </Marker>
            ))}
            {/* Markers for connected popular stations */}
            {isSingleStation &&
              stationPosition &&
              connectedStations.map((cs, i) => (
                <Marker key={`connected-${i}`} position={cs.position}>
                  <Popup>
                    <strong>{cs.name}</strong>
                    <br />
                    {cs.journeyCount} journeys
                    <br />
                    {cs.type === 'departure'
                      ? 'Departure station'
                      : 'Return station'}
                  </Popup>
                </Marker>
              ))}
            {/* Polylines connecting the current station to popular departure/return stations */}
            {isSingleStation &&
              stationPosition &&
              connectedStations.map((cs, i) => {
                const isSelected = selectedIndex === i;
                return (
                  <Polyline
                    key={`line-${i}-${isSelected ? 'selected' : 'default'}`}
                    positions={[stationPosition, cs.position]}
                    pathOptions={{
                      color: isSelected
                        ? '#ec1515'
                        : cs.type === 'departure'
                          ? '#1976d2'
                          : '#d32f2f',
                      weight: isSelected ? 6 : 3,
                      opacity: selectedIndex === null || isSelected ? 0.9 : 0.3,
                    }}
                  />
                );
              })}
          </MapContainer>
        </Box>
        {/* Lists of top 5 departure and return stations next to the map */}
        {isSingleStation && connectedStations.length > 0 && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              overflowY: 'auto',
              maxHeight: '70vh',
            }}
          >
            {popularDepartureStations &&
              popularDepartureStations.length > 0 && (
                <Box mb={2}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#1976d2', fontWeight: 'bold' }}
                  >
                    Top departure stations
                  </Typography>
                  <List dense>
                    {popularDepartureStations.map((station, i) => {
                      // Index in connectedStations for departure items
                      const csIndex = connectedStations.findIndex(
                        (cs) =>
                          cs.type === 'departure' &&
                          cs.name === station.departureStationName,
                      );
                      const isSelected = selectedIndex === csIndex;
                      return (
                        <ListItem key={`dep-${i}`} disablePadding>
                          <ListItemButton
                            selected={isSelected}
                            onClick={() =>
                              setSelectedIndex(isSelected ? null : csIndex)
                            }
                            sx={{
                              borderLeft: isSelected
                                ? '4px solid #1976d2'
                                : '4px solid transparent',
                              py: 0.5,
                            }}
                          >
                            <ListItemText
                              primary={`${i + 1}. ${station.departureStationName}`}
                              secondary={`${station.journeyCount} journeys`}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              )}
            {popularReturnStations && popularReturnStations.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: '#d32f2f', fontWeight: 'bold' }}
                >
                  Top return stations
                </Typography>
                <List dense>
                  {popularReturnStations.map((station, i) => {
                    // Index in connectedStations for return items
                    const csIndex = connectedStations.findIndex(
                      (cs) =>
                        cs.type === 'return' &&
                        cs.name === station.returnStationName,
                    );
                    const isSelected = selectedIndex === csIndex;
                    return (
                      <ListItem key={`ret-${i}`} disablePadding>
                        <ListItemButton
                          selected={isSelected}
                          onClick={() =>
                            setSelectedIndex(isSelected ? null : csIndex)
                          }
                          sx={{
                            borderLeft: isSelected
                              ? '4px solid #ec1515'
                              : '4px solid transparent',
                            py: 0.5,
                          }}
                        >
                          <ListItemText
                            primary={`${i + 1}. ${station.returnStationName}`}
                            secondary={`${station.journeyCount} journeys`}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MapView;
