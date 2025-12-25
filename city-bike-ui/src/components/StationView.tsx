import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getStation } from '../reducers/stationReducer'
import type { AppDispatch, RootState } from '../store'
import {
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
  Typography,
  Card,
  CardContent,
} from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart';


// component that show the station information
const StationView = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams<{ id: string }>() // get id value from stationList component
  const station = useSelector(({ station } : RootState) => station) // get the station info from store
  const isLoading = useSelector(({ loading } : RootState) => loading) // loading state for handling loading image
  
  useEffect(() => {
    // dispatch the id to the reducer everytime whenever id change
    dispatch(getStation(Number(id)))
  }, [dispatch, id])

  // cards for station information
  const cards = [
    {
      id: 'address',
      title: 'Address',
      content: station?.data.address,
    },
    {
      id: 'id',
      title: 'Station ID',
      content: station?.data.id,
    },
    {
      id: 'departureStationCount',
      title: 'Total number of journeys starting from the station',
      content: station?.departureStationCount,
    },
    {
      id: 'returnStationCount',
      title: 'Total number of journeys ending at the station',
      content: station?.returnStationCount,
    },
    {
      id: 'avgDepartureDistance',
      title: 'The average distance of a journey starting from the station (km)',
      content: station?.avgDepartureStationDistance,
    },
    {
      id: 'avgReturnDistance',
      title: 'The average distance of a journey ending at the station (km)',
      content: station?.avgReturnStationDistance,
    },
  ]

  console.log("stationView", station)
  if (station?.success === false) {
    return (
      <div>
        <Alert severity="error">
          <AlertTitle>
            Information not found, try again a different name
          </AlertTitle>
        </Alert>
      </div>
    )
  }
  return (
    <div>
      {!isLoading && station ? (
        <div>
          <h2>Station informations</h2>
          <div>
            <Box
              sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(170px, 100%), 1fr))',
                gap: 1,
              }}
            >
              {cards.map((card) => (
                <Card key={card.id} sx={{ maxWidth: 200, marginBottom: 2, marginTop: 2, boxShadow: 4 }}>
                  <CardContent>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h6" component="div">
                      {card.content}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </div>
          <div>
            <Box sx={{ width: '100%' , height: 300}}>
              <Typography marginTop={2}>
                Top 5 most popular departure stations for journeys ending at the station
              </Typography>
              <BarChart
                series={[
                  { data: station?.popularDepartureStations.map((s) => s.journeyCount), label: "Journey count" },
                ]}
                xAxis={[{ data: station?.popularDepartureStations.map((s) => s.departureStationName) }]}
                yAxis={[{ width: 50  }]}
              />
            </Box>
          </div>
          <div>
            <Box sx={{ width: '%' , height: 300}}>
              <Typography marginTop={2}>
                Top 5 most popular return stations for journeys starting from the station
              </Typography>
              <BarChart
                series={[
                  { data: station?.popularReturnStations.map((s) => s.journeyCount), label: "Journey count" },
                ]}
                xAxis={[{ data: station?.popularReturnStations.map((s) => s.returnStationName) }]}
                yAxis={[{ width: 50  }]}
              />
            </Box>
          </div>
        </div>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  )
}
export default StationView
