import { configureStore } from '@reduxjs/toolkit';
import authReducer from './modules/auth/slices/auth';
import workspacesReducer from './modules/workspaces/slices/workspaces';
import boardReducer from './modules/board/slices/boardSlice';

export const store = configureStore({
  reducer: {
    authData: authReducer,
    workspaces: workspacesReducer,
    board: boardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
