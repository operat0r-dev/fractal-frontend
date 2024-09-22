import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JWTTokenResponse, User } from '../interfaces/types';
import {
  setLocalStorageItem,
  removeLocalStorageItem,
} from '@/modules/core/helpers/LocalStorage';

type AuthState = {
  tokenData: JWTTokenResponse | null;
  user: User | null;
};

const initialState: AuthState = {
  tokenData: null,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokenData: (state, action: PayloadAction<JWTTokenResponse>) => {
      setLocalStorageItem('token_data', action.payload);
      state.tokenData = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      setLocalStorageItem('user', action.payload);
      state.user = action.payload;
    },
    logout: (state) => {
      removeLocalStorageItem('token_data');
      removeLocalStorageItem('user');
      state.tokenData = null;
      state.user = null;
    },
  },
});

export const { setTokenData, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
