import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import authService from '../services/auth';
import { AuthResponse, AuthState, LoginFormValues } from '../types';
import { AppDispatch } from '../store';

const initialState: AuthState = {
  token: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

// reducer that set the state for authentication data
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthResponse>) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

// dispatch the data to store
export const loginUser = (credentials: LoginFormValues) => {
  return async (dispatch: AppDispatch) => {
    try {
      const data = await authService.login(credentials);
      console.log('reducer', data);
      dispatch(loginSuccess(data));
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
};

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
