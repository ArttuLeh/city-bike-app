import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import journeyService from '../services/journeys'
import { toggleLoading } from './loadingReducer'
import { JourneyFormValues, JourneysResponse } from '../types'

// reducer that set the state for journey data
const journeysSlice = createSlice({
  name: 'journeys',
  initialState: null as JourneysResponse | null,
  reducers: {
    setJourneys(state, action: PayloadAction<JourneysResponse>) {
      return action.payload
    },
    appendJourney(state, action: PayloadAction<any>) {
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

export const addNewJourney = (content: JourneyFormValues) => {
  return async (dispatch: any) => {
    try {
      const newJourney = await journeyService.create(content)
      dispatch(appendJourney(newJourney))
    } catch (error) {
      console.error('Error adding new journey:', error)
    } 
  }
}

export const { setJourneys, appendJourney } = journeysSlice.actions
export default journeysSlice.reducer
