import { configureStore } from '@reduxjs/toolkit';
import authReducer from './modules/auth/slices/auth';

export const store = configureStore({
  reducer: {
    authData: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
