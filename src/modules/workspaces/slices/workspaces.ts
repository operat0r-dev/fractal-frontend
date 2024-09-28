import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

type Workspace = {
  id: number;
  name: string;
  current: boolean;
};

type WorkspacesState = {
  workspaces: Workspace[];
};

const initialState: WorkspacesState = {
  workspaces: [],
};

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;
    },
  },
});

export const currentWorkspace = (state: RootState) => {
  return state.workspaces.workspaces.find((workspace) => workspace.current);
};

export const userWorkspaces = (state: RootState) => {
  return state.workspaces.workspaces.filter((workspace) => !workspace.current);
};

export const { setWorkspaces } = workspacesSlice.actions;

export default workspacesSlice.reducer;
