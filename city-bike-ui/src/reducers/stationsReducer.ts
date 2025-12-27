import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import stationsService from '../services/stations'
import { toggleLoading } from './loadingReducer'
import { StationsResponse, StationFormValues } from '../types'


// reducer that set the state for all the stations data
const stationsSlice = createSlice({
  name: 'stations',
  initialState: null as StationsResponse | null,
  reducers: {
    setStations(state, action: PayloadAction<StationsResponse>) {
      return action.payload
    },
    appendStation(state, action: PayloadAction<any>) {
      return action.payload 
    },
  },
})

export const initializeStations = (currentPage: number, searchTerm: string) => {
  return async (dispatch: any) => {
    // call axios
    const response = await stationsService.getAll(currentPage, searchTerm)
    dispatch(toggleLoading(true))
    console.log("stationsReducer", currentPage)
    dispatch(setStations(response)) // Assuming totalPages is 1 for simplicity
    dispatch(toggleLoading(false))
  }
}

export const addNewStation = (content: StationFormValues) => {
  return async (dispatch: any) => {
    try {
      const newStation = await stationsService.create(content)
      dispatch(appendStation(newStation))
    } catch (error) {
      console.error('Error adding new journey:', error)
    } 
  }
}

export const { setStations, appendStation } = stationsSlice.actions
export default stationsSlice.reducer
