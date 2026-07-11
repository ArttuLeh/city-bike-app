import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress, TextField, Typography } from '@mui/material';
import { useEffect, useState, ChangeEvent, useMemo } from 'react';
import { initializeStations } from '../reducers/stationsReducer';
import SearchedStationsData from './SearchedStationData';
import StationsData from './StationsData';
import { AppDispatch, RootState } from '../store';

// component that lists all the stations
// using material ui
const StationList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1); // state for handling current page
  const [searchTerm, setSearchTerm] = useState(''); // state for searching value
  const stations = useSelector(({ stations }: RootState) => stations); // get the stations data from the store
  const isLoading = useSelector(({ loading }: RootState) => loading); //loading state for handling loading image

  useEffect(() => {
    const delay = setTimeout(() => {
      // dispatch the currentpage value to the reducer whenever user change the page
      dispatch(initializeStations(currentPage, searchTerm));
    }, 1000);
    return () => clearTimeout(delay);
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    // handle page change and set the value
    event.preventDefault();
    console.log('page', value);
    setCurrentPage(value);
  };

  // handle setting search value
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const content = useMemo(() => {
    if (searchTerm) {
      return (
        <SearchedStationsData
          stations={stations ?? { data: [], totalPages: 0 }}
          handlePageChange={handlePageChange}
        />
      );
    }

    if (!isLoading && stations) {
      return (
        <StationsData
          stations={stations ?? { data: [], totalPages: 0 }}
          handlePageChange={handlePageChange}
        />
      );
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }, [stations, isLoading, searchTerm]);

  return (
    <div>
      <Typography align="center" variant="h4" sx={{ mb: 3 }}>
        Stations
      </Typography>
      <Box>
        <TextField
          fullWidth
          id="search"
          type="search"
          label="Search station by name"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 3, backgroundColor: '#fff', borderRadius: 1 }}
        />
      </Box>
      {content}
    </div>
  );
};
export default StationList;
