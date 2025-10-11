import { configureStore } from '@reduxjs/toolkit'
import stationsReducer from './reducers/stationsReducer'
import stationReducer from './reducers/stationReducer'
import journeyReducer from './reducers/journeyReducer'
import loadingReducer from './reducers/loadingReducer'

// store the all states
const store = configureStore({
  reducer: {
    stations: stationsReducer,
    station: stationReducer,
    journeys: journeyReducer,
    loading: loadingReducer,
  },
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
