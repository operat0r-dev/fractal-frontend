import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { Task } from '../domain';
import { TaskDto } from '@/modules/tasks/api/dto';

const tasksAdapter = createEntityAdapter<Task>({
  sortComparer: (a, b) => a.seq - b.seq,
});

export interface TasksSliceState extends EntityState<Task, number> {
  currentTask: Task | null;
}

const initialState: TasksSliceState = tasksAdapter.getInitialState({
  currentTask: null,
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskUpdated: (state, action: PayloadAction<Task>) => {
      const { id, title, column_id, seq } = action.payload;

      const existingTask = state.entities[id];

      if (existingTask) {
        existingTask.title = title;
        existingTask.column_id = column_id;
        existingTask.seq = seq;
      }
    },
    setReduxTasks: (state, action: PayloadAction<Task[]>) => {
      tasksAdapter.setAll(state, action.payload);
    },
    addNewTask: (state, action: PayloadAction<TaskDto>) => {
      const task = action.payload;
      const labels = task.labels.map(({ id }) => id);

      tasksAdapter.addOne(state, { ...task, labels, user_id: null });
    },
    setCurrentTask: (state, action: PayloadAction<number>) => {
      state.currentTask = state.entities[action.payload];
    },
    updateTask: (state, action: PayloadAction<TaskDto>) => {
      const { id, labels, user } = action.payload;
      const newLabels = labels.map(({ id }) => id);

      tasksAdapter.updateOne(state, {
        id,
        changes: { labels: newLabels, user_id: user ? user.id : null },
      });
    },
    resetTasks: () => initialState,
  },
});

export const {
  taskUpdated,
  setReduxTasks,
  addNewTask,
  setCurrentTask,
  updateTask,
  resetTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

export const {
  selectAll: selectAllTasks,
  selectIds: selectAllTaskIds,
  selectById: selectTaskById,
} = tasksAdapter.getSelectors((state: RootState) => state.tasks);

export const selectAllTasksOrderedBySeq = createSelector(
  [selectAllTasks],
  (tasks) => tasks.sort((a, b) => a.seq - b.seq)
);
