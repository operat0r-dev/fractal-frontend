import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/modules/auth/slices/auth';
import workspacesReducer from '@/modules/workspaces/slices/workspacesSlice';
import kanbanBoardReducer from '@/modules/board/slices/kanbanBoardSlice';
import columnsReducer from '@/modules/board/slices/columnsSlice';
import tasksReducer from '@/modules/board/slices/tasksSlice';
import labelsReducer from '@/modules/labels/slices/labelsSlice';
import boardsReducer from '@/modules/workspaces/slices/boardsSlice';
import usersReducer from '@/modules/users/slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspaces: workspacesReducer,
    kanbanBoard: kanbanBoardReducer,
    columns: columnsReducer,
    tasks: tasksReducer,
    labels: labelsReducer,
    boards: boardsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
