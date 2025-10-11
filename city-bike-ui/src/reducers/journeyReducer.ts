import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import journeyService from '../services/journeys'
import { toggleLoading } from './loadingReducer'
import { /*Journey,*/ JourneysResponse } from '../types'

// reducer that set the state for journey data
const journeysSlice = createSlice({
  name: 'journeys',
  initialState: null as JourneysResponse | null,
  reducers: {
    setJourneys(state, action: PayloadAction<JourneysResponse>) {
      return action.payload
    },
  },
})

// dispatch the data to store
export const initializeJourneys = (
  currentPage: number,
  sortField: any,
  sortOrder: string,
  searchTerm: string
) => {
  return async (dispatch: any) => {
    // call axios
    const data = await journeyService.getAll(
      currentPage,
      sortField,
      sortOrder,
      searchTerm
    )
    dispatch(toggleLoading(true))
    dispatch(setJourneys(data))
    dispatch(toggleLoading(false))
  }
}
export const { setJourneys } = journeysSlice.actions
export default journeysSlice.reducer
