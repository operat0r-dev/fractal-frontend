import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { ReduxWorkspace } from '../types/stateTypes';
import { Workspace } from '../types/types';

export interface WorkspacesSliceState
  extends EntityState<ReduxWorkspace, number> {
  current: ReduxWorkspace | undefined;
}

const workspacesAdapter = createEntityAdapter<ReduxWorkspace>();

const initialState: WorkspacesSliceState = workspacesAdapter.getInitialState({
  current: undefined,
});

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setReduxWorkspaces: (state, action: PayloadAction<ReduxWorkspace[]>) => {
      workspacesAdapter.setAll(state, action.payload);
    },
    setCurrentWorkspace: (state, action: PayloadAction<ReduxWorkspace>) => {
      state.current = action.payload;
    },
    switchWorkspaces: (
      state,
      action: PayloadAction<{
        prevWorkspaceId: number;
        currWorkspaceId: number;
      }>
    ) => {
      const { prevWorkspaceId, currWorkspaceId } = action.payload;
      const previousWorkspace = state.entities[prevWorkspaceId];
      const currentWorkspace = state.entities[currWorkspaceId];

      previousWorkspace.current = false;
      currentWorkspace.current = true;
    },
    updateReduxWorkspace: (state, action: PayloadAction<Workspace>) => {
      const { id, name, description } = action.payload;

      const workspace = state.entities[id];

      if (workspace) {
        workspace.name = name;
        workspace.description = description;
      }
    },
  },
});

export const {
  setReduxWorkspaces,
  setCurrentWorkspace,
  updateReduxWorkspace,
  switchWorkspaces,
} = workspacesSlice.actions;

export default workspacesSlice.reducer;

export const {
  selectAll: selectAllWorkspaces,
  selectIds: selectworkspacesIds,
  selectById: selectWorkspaceById,
} = workspacesAdapter.getSelectors((state: RootState) => state.workspaces);

export const selectCurrentWorkspace = createSelector(
  [selectAllWorkspaces],
  (workspaces) => workspaces.find((workspace) => workspace.current)
);
