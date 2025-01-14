import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Board } from '@/modules/board/domain';

const boardsAdapter = createEntityAdapter<Board>();

const initialState: EntityState<Board, number> = boardsAdapter.getInitialState(
  {}
);

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setReduxBoards: (state, action: PayloadAction<Board[]>) => {
      boardsAdapter.setAll(state, action.payload);
    },
    addReduxBoard: (state, action: PayloadAction<Board>) => {
      boardsAdapter.addOne(state, action.payload);
    },
    resetBoards: () => initialState,
  },
});

export const { setReduxBoards, addReduxBoard, resetBoards } =
  boardsSlice.actions;

export default boardsSlice.reducer;

export const {
  selectAll: selectAllBoards,
  selectIds: selectBoardsIds,
  selectById: selectBoardById,
} = boardsAdapter.getSelectors((state: RootState) => state.boards);
