import { Link } from 'react-router-dom'
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
} from '@mui/material'
import { Station } from '../types'

interface Props {
  stations: {
    data: Station[]
    totalPages: number
  }
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void
}

const StationData = ({ stations, handlePageChange } : Props) => {

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
  console.log("stationsdata", stations) 
  return (
    <div>
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
                <TableCell>
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
      <Stack
        spacing={3}
        sx={{
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center' }}
          count={stations.totalPages}
          onChange={handlePageChange}
        />
      </Stack>
    </div>
  )
}
export default StationData
