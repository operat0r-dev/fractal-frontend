import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { ApiLabel } from '../types/apiTypes';

const taskLabelsAdapter = createEntityAdapter<ApiLabel>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState: EntityState<ApiLabel, number> =
  taskLabelsAdapter.getInitialState();

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    labelsUpdated: (state, action: PayloadAction<ApiLabel>) => {
      const { id, name, color, pivot } = action.payload;

      const existingLabel = state.entities[id];

      if (existingLabel) {
        existingLabel.name = name;
        existingLabel.color = color;
        existingLabel.pivot.task_id = pivot.task_id;
      }
    },
    setReduxLabels: (state, action: PayloadAction<ApiLabel[]>) => {
      taskLabelsAdapter.setAll(state, action.payload);
    },
  },
});

export const { labelsUpdated, setReduxLabels } = tasksSlice.actions;

export default tasksSlice.reducer;

export const {
  selectAll: selectAllLabels,
  selectIds: selectAllLabelIds,
  selectById: selectLabelById,
} = taskLabelsAdapter.getSelectors((state: RootState) => state.labels);
