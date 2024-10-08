import { configureStore } from '@reduxjs/toolkit';
import authReducer from './modules/auth/slices/auth';
import workspacesReducer from './modules/workspaces/slices/workspaces';
import boardReducer from './modules/board/slices/boardSlice';
import columnsReducer from './modules/board/slices/columnsSlice';
import tasksReducer from './modules/board/slices/tasksSlice';
import labelsReducer from './modules/board/slices/labelsSlice';

export const store = configureStore({
  reducer: {
    authData: authReducer,
    workspaces: workspacesReducer,
    board: boardReducer,
    columns: columnsReducer,
    tasks: tasksReducer,
    labels: labelsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
