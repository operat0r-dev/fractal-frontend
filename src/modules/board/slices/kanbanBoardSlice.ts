import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface KanbanBoardState {
  sidebarOpen: boolean;
}

const initialState: KanbanBoardState = {
  sidebarOpen: true,
};

export const kanbanBoardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { setSidebarOpen } = kanbanBoardSlice.actions;

export default kanbanBoardSlice.reducer;
