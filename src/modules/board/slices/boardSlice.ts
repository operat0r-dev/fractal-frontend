import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BoardState {
  sidebarOpen: boolean;
}

const initialState: BoardState = {
  sidebarOpen: true,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setSidebarOpen } = boardSlice.actions;

export default boardSlice.reducer;
