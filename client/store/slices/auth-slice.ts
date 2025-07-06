import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string; // Changed from number to string for Supabase compatibility
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  lastActivity: number;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  lastActivity: Date.now(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.lastActivity = Date.now();
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.lastActivity = Date.now();
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.lastActivity = 0;
    },
  },
});

export const { setUser, setAccessToken, updateLastActivity, logout } = authSlice.actions;
export default authSlice.reducer;