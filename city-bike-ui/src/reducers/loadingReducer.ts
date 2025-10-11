import { createSlice } from '@reduxjs/toolkit'

// reducer that set the state for loading image
export const loadingSlice = createSlice({
  name: 'loading',
  initialState: true,
  reducers: {
    toggleLoading(state, { payload }) {
      return payload
    },
  },
})

export const { toggleLoading } = loadingSlice.actions
export default loadingSlice.reducer
