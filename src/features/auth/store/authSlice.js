import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('authToken');

const initialState = {
  user: null,
  isAuthenticated: !!token, // true if token exists in localStorage
  token: token || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.token = action.payload.token || null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('industry_verificationToken');
      sessionStorage.removeItem('industry_email');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

