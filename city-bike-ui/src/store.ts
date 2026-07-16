import { configureStore } from '@reduxjs/toolkit';
import stationsReducer from './reducers/stationsReducer';
import stationReducer from './reducers/stationReducer';
import journeyReducer from './reducers/journeyReducer';
import loadingReducer from './reducers/loadingReducer';
import authReducer from './reducers/authReducer';

// store the all states
const store = configureStore({
  reducer: {
    stations: stationsReducer,
    station: stationReducer,
    journeys: journeyReducer,
    loading: loadingReducer,
    auth: authReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
