import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiLabel } from '../types/apiTypes';

export interface BoardState {
  sidebarOpen: boolean;
  labels: ApiLabel[];
}

const initialState: BoardState = {
  sidebarOpen: false,
  labels: [],
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLabels: (state, action: PayloadAction<ApiLabel[]>) => {
      state.labels = action.payload;
    },
  },
});

export const { setSidebarOpen, setLabels } = boardSlice.actions;

export default boardSlice.reducer;
