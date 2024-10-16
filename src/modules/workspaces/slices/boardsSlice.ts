import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { ReduxBoard } from '../types/stateTypes';

const boardsAdapter = createEntityAdapter<ReduxBoard>();

const initialState: EntityState<ReduxBoard, number> =
  boardsAdapter.getInitialState({});

const boardsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    udpateBoard: (state, action: PayloadAction<ReduxBoard>) => {
      const { id, name, description } = action.payload;

      const existingColumn = state.entities[id];

      if (existingColumn) {
        existingColumn.name = name;
        existingColumn.description = description;
      }
    },
    setReduxBoards: (state, action: PayloadAction<ReduxBoard[]>) => {
      boardsAdapter.setAll(state, action.payload);
    },
    addReduxBoard: (state, action: PayloadAction<ReduxBoard>) => {
      boardsAdapter.addOne(state, action.payload);
    },
    resetBoards: () => initialState,
  },
});

export const { addReduxBoard, udpateBoard, setReduxBoards, resetBoards } =
  boardsSlice.actions;

export default boardsSlice.reducer;

export const {
  selectAll: selectAllBoards,
  selectIds: selectBoardsIds,
  selectById: selectBoardById,
} = boardsAdapter.getSelectors((state: RootState) => state.boards);
