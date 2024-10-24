import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Label } from '../domain';

const taskLabelsAdapter = createEntityAdapter<Label>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState: EntityState<Label, number> =
  taskLabelsAdapter.getInitialState();

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    labelsUpdated: (state, action: PayloadAction<Label>) => {
      const { id, name, color } = action.payload;

      const existingLabel = state.entities[id];

      if (existingLabel) {
        existingLabel.name = name;
        existingLabel.color = color;
      }
    },
    setReduxLabels: (state, action: PayloadAction<Label[]>) => {
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
