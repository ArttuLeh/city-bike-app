import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import stationsService from '../services/stations'
import { toggleLoading } from './loadingReducer'
import { StationDetails } from '../types'

// reducer that set the state for station data
const stationSlice = createSlice({
  name: 'station',
  initialState: null as StationDetails | null,
  reducers: {
    setStation(state, action: PayloadAction<StationDetails>) {
      return action.payload
    },
  },
})

// dispatch the data to store
export const getStation = (id: number) => {
  return async (dispatch: any) => {
    // call axios
    const data = await stationsService.getStation(id)
    console.log("reducer", data)
    dispatch(toggleLoading(true))
    dispatch(setStation(data))
    dispatch(toggleLoading(false))
  }
}
export const { setStation } = stationSlice.actions
export default stationSlice.reducer
