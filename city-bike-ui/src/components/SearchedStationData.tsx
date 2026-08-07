import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Pagination,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Station } from '../types';
import { RootState } from '../store';

interface Props {
  stations: {
    data: Station[];
    totalPages: number;
    success?: boolean;
  };
  handlePageChange: (event: ChangeEvent<unknown>, value: number) => void;
}

const SearchedStationsData = ({ stations, handlePageChange }: Props) => {
  const isLoading = useSelector(({ loading }: RootState) => loading); // loading state for handling loading image
  const navigate = useNavigate();

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
  ];

  return (
    <div>
      {!isLoading && stations.data ? (
        <TableContainer component={Paper} elevation={0}>
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
                <TableRow
                  key={station.id}
                  onClick={() => navigate(`/station/${station.id}`)}
                  tabIndex={0}
                  role="link"
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{station.name}</TableCell>
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
      {
        <Stack spacing={3} sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Pagination
            sx={{ display: 'flex', justifyContent: 'center' }}
            count={stations.totalPages}
            onChange={handlePageChange}
          />
        </Stack>
      }
    </div>
  );
};
export default SearchedStationsData;
