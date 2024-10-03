import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from './types/types';

type BoardState = {
  currentTask: Task | undefined;
  sidebarOpen: boolean;
};

const initialState: BoardState = {
  currentTask: undefined,
  sidebarOpen: false,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setCurrentTask, setSidebarOpen } = boardSlice.actions;

export default boardSlice.reducer;
