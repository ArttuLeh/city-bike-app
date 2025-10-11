import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'
import { useEffect, useState, ChangeEvent } from 'react'
import { initializeStations } from '../reducers/stationsReducer'
import SearchedStationsData from './SearchedStationData'
import StationsData from './StationsData'
import { toggleLoading } from '../reducers/loadingReducer'
//import { Station } from '../types'
import { AppDispatch, RootState } from '../store'

/*interface Props {
  stations: {
    data: Station[]
    totalPages: number
  }
  loading?: boolean
}*/


// component that lists all the stations
// using material ui
const StationList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [currentPage, setCurrentPage] = useState(1) // state for handling current page
  const [searchTerm, setSearchTerm] = useState('') // state for searching value
  const stations = useSelector(({ stations }: RootState) => stations) // get the stations data from the store
  //const isLoading = useSelector(({ loading } : Props) => loading) //loading state for handling loading image

  useEffect(() => {
    dispatch(toggleLoading(false))
    const delay = setTimeout(() => {
      // dispatch the currentpage value to the reducer whenever user change the page
      dispatch(initializeStations(currentPage, searchTerm))
    }, 1000)
    return () => clearTimeout(delay)
  }, [dispatch, currentPage, searchTerm])

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    // handle page change and set the value
    event.preventDefault()
    console.log("page", value)
    setCurrentPage(value)
  }

  // handle setting search value
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  //console.log("stationlist", stations)
  if (searchTerm) {
    return (
      <div>
        <h2>Stations</h2>
        <Box>
          <TextField
            id="search"
            type="search"
            label="Search station by name"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: 600 }}
          />
        </Box>
        <SearchedStationsData
          stations={stations ?? { data: [] }}
          handlePageChange={handlePageChange}
        />
      </div>
    )
  }
  return (
    <div>
      <h2>Stations</h2>
      <Box>
        <TextField
          id="search"
          type="search"
          label="Search station by name"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: 600 }}
        />
      </Box>
      <StationsData stations={stations ?? { data: [], totalPages: 0 }} handlePageChange={handlePageChange} />
    </div>
  )
}
export default StationList
