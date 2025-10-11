import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Station } from '../types'
import { RootState } from '../store'

interface Props {
  stations: {
    data: Station[]
    success?: boolean
  }
  handlePageChange: (event: React.ChangeEvent<{}>, value: number) => void
}

const SearchedStationsData = ({ stations } : Props) => {
  const isLoading = useSelector(({ loading } : RootState) => loading) // loading state for handling loading image

  // array of objects for table cell
  const headCell = [
    {
      id: 'name',
      numeric: false,
      label: 'Station name',
    },
    {
      id: 'address',
      numeric: true,
      label: 'Address',
    },
    {
      id: 'id',
      numeric: true,
      label: 'Station ID',
    },
  ]

  if (isLoading && stations.success === true) {
    // show user if searched value not found
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
      {!isLoading && stations.data ? (
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
              {stations.data.map((station) => (
                <TableRow key={station.id} sx={{ boxShadow: 4 }}>
                  <TableCell className="row">
                    <Link to={`/stations/${station.id}`}>{station.name}</Link>
                  </TableCell>
                  <TableCell align="right">
                    {station.address} {station.town}
                  </TableCell>
                  <TableCell align="right">{station.id}</TableCell>
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
    </div>
  )
}
export default SearchedStationsData
