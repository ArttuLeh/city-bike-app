import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Stack,
  Pagination,
  Box,
  CircularProgress,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { ChangeEvent } from 'react'
import { Journey } from '../types'
import { RootState } from '../store'

interface Props {
  journeys: {
    data: Journey[]
    totalPages: number
    success?: boolean
  }
  handlePageChange: (event: ChangeEvent<unknown>, value: number) => void
  handleSort: (value: string) => void
  loading?: boolean
}

//component that show the searched data
const SearchedJourneysData = ({ journeys, handlePageChange } : Props) => {
  const isLoading = useSelector(({ loading } : RootState) => loading) // loading state for handling loading image

  // array of objects for table cell
  const headCell = [
    {
      id: 'Departure_station_id',
      numeric: false,
      label: 'Departure station id',
    },
    {
      id: 'Departure_station_name',
      numeric: true,
      label: 'Departure station name',
    },
    {
      id: 'Return_station_name',
      numeric: true,
      label: 'Return station name',
    },
    {
      id: 'Covered_distance_m',
      numeric: true,
      label: 'Covered distance (km)',
    },
    {
      id: 'Duration_sec',
      numeric: true,
      label: 'Duration (min)',
    },
  ]
  
  return (
    <div>
      {!isLoading && journeys.data ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ boxShadow: 4 }}>
                {headCell.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sx={{ fontWeight: 'bold' }}
                    align={headCell.numeric ? 'right' : 'left'}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {journeys.data.map((journey) => (
                <TableRow key={journey.id} sx={{ boxShadow: 4 }}>
                  <TableCell>{journey.departure_station_id}</TableCell>
                  <TableCell className="row" align="right">
                    {journey.departure_station_name}
                  </TableCell>
                  <TableCell align="right">
                    {journey.return_station_name}
                  </TableCell>
                  <TableCell align="right">
                    {(journey.covered_distance_m / 1000).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {(journey.duration_sec / 60).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
      {
        <Stack spacing={3} sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Pagination
            sx={{ display: 'flex', justifyContent: 'center' }}
            count={journeys.totalPages}
            onChange={handlePageChange}
          />
        </Stack>
      }
    </div>
  )
}
export default SearchedJourneysData
