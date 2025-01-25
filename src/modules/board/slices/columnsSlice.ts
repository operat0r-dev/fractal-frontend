import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Column } from '../domain';
import { createSelector } from '@reduxjs/toolkit';

const columnsAdapter = createEntityAdapter<Column>({
  sortComparer: (a, b) => a.seq - b.seq,
});

const initialState: EntityState<Column, number> =
  columnsAdapter.getInitialState({});

const columnsSlice = createSlice({
  name: 'columns',
  initialState,
  reducers: {
    updateReduxColumn: (state, action: PayloadAction<Column>) => {
      const { id, color, name, seq } = action.payload;

      const existingColumn = state.entities[id];

      if (existingColumn) {
        existingColumn.name = name;
        existingColumn.color = color;
        existingColumn.seq = seq;
      }
    },
    updateColumnsTasks: (
      state,
      action: PayloadAction<{
        destinationIndex: number;
        destinationId: number;
        sourceId: number;
        taskId: number;
      }>
    ) => {
      const { sourceId, destinationId, destinationIndex, taskId } =
        action.payload;

      const taskIndex = state.entities[sourceId].tasks.indexOf(taskId);
      state.entities[sourceId].tasks.splice(taskIndex, 1);
      state.entities[destinationId].tasks.splice(destinationIndex, 0, taskId);
    },
    addColumnTask: (
      state,
      action: PayloadAction<{ columnId: number; taskId: number }>
    ) => {
      const col = state.entities[action.payload.columnId];
      col.tasks = [...col.tasks, action.payload.taskId];
    },
    setReduxColumns: (state, action: PayloadAction<Column[]>) => {
      columnsAdapter.setAll(state, action.payload);
    },
    addNewColumn: (state, action: PayloadAction<Column>) => {
      columnsAdapter.addOne(state, action.payload);
    },
    resetColumns: () => initialState,
  },
});

export const {
  updateReduxColumn,
  setReduxColumns,
  addNewColumn,
  updateColumnsTasks,
  resetColumns,
  addColumnTask,
} = columnsSlice.actions;

export default columnsSlice.reducer;

export const {
  selectAll: selectAllColumns,
  selectIds: selectColumnIds,
  selectById: selectColumnById,
} = columnsAdapter.getSelectors((state: RootState) => state.columns);

export const selectAllColumnsOrderedBySeq = createSelector(
  [selectAllColumns],
  (columns) => columns.sort((a, b) => a.seq - b.seq)
);
