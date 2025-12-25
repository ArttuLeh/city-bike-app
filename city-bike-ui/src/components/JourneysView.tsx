import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField, CircularProgress, } from '@mui/material'
import { useEffect, useState, ChangeEvent } from 'react'
import { initializeJourneys } from '../reducers/journeyReducer'
import SearchedJourneysData from './SearchedJourneysData'
import JourneysData from './JourneysData'
import { AppDispatch, RootState } from '../store'

// component that handle which jorneys show, searched or all
const JourneysList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [currentPage, setCurrentPage] = useState<number>(1) // state for curren page
  const [sortField, setSortField] = useState<string>('') // state for sortfield
  const [sortOrder, setSortOrder] = useState<string>('') // state for sortorder (asc or desc)
  const [searchTerm, setSearchTerm] = useState<string>('') // state for searching value
  const journeys = useSelector(({ journeys } : RootState) => journeys) // get the journeys data from the store
  const isLoading = useSelector(({ loading } : RootState) => loading) // loading state for handling loading image

  useEffect(() => {
    const delay = setTimeout(() => {
      // delay for searching
      dispatch(
        // dispatch values to the reducer
        initializeJourneys(currentPage, sortField, sortOrder, searchTerm)
      )
    }, 1000)
    return () => clearTimeout(delay) // clear the timeout
  }, [dispatch, currentPage, sortField, sortOrder, searchTerm])

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    // handle page change and set the value
    event.preventDefault()
    setCurrentPage(value)
  }

  // hande setting sortfield and sortorder value
  const handleSort = (value: string) => {
    if ((sortField === '' && sortOrder === '') || sortOrder === 'desc') {
      setSortField(value)
      setSortOrder('asc')
    } else {
      setSortField(value)
      setSortOrder('desc')
    }
  }
  // handle setting search value
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSortField('')
    setSortOrder('')
    setSearchTerm(event.target.value)
  }

  if (searchTerm) {
    // if the search term exist show the details of the searched journeys
    return (
      <div>
        <h2>Journeys</h2>
        <Box>
          <TextField
            id="search"
            type="search"
            label="Search departure station by name"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: 600 }}
          />
        </Box>
        <SearchedJourneysData
          journeys={journeys ?? { data: [], totalPages: 0 }}
          handleSort={handleSort}
          handlePageChange={handlePageChange}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>Journeys</h2>
        <Box>
          <TextField
            id="search"
            type="search"
            label="Search departure station by name"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: 600 }}
          />
        </Box>
      {!isLoading && journeys ? (
        <JourneysData
          journeys={journeys ?? { data: [], totalPages: 0 }}
          sortOrder={sortOrder}
          sortField={sortField}
          handlePageChange={handlePageChange}
          handleSort={handleSort}
        />
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  )
}
export default JourneysList
