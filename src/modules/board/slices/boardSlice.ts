import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../types/Board';
import { TaskLabel } from '../types/TaskLabel';

type BoardState = {
  currentTask: Task | undefined;
  sidebarOpen: boolean;
  labels: TaskLabel[];
};

const initialState: BoardState = {
  currentTask: undefined,
  sidebarOpen: false,
  labels: [],
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
    setLabels: (state, action: PayloadAction<TaskLabel[]>) => {
      state.labels = action.payload;
    },
  },
});

export const { setCurrentTask, setSidebarOpen, setLabels } = boardSlice.actions;

export default boardSlice.reducer;
