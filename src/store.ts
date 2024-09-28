import { configureStore } from '@reduxjs/toolkit';
import authReducer from './modules/auth/slices/auth';
import workspacesReducer from './modules/workspaces/slices/workspaces';

export const store = configureStore({
  reducer: {
    authData: authReducer,
    workspaces: workspacesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
