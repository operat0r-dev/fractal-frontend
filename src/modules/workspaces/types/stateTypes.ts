export interface ReduxWorkspace {
  id: number;
  name: string;
  description?: string;
  users: number[];
  boards: number[];
  current: boolean;
}

export interface ReduxBoard {
  id: number;
  name: string;
  description?: string;
  workspace_id: number;
}

export interface ReduxUser {
  id: number;
  name: string;
  email: string;
  workspaces: number[];
}

export interface ReduxLabel {
  id: number;
  board_id: number;
  color: string;
  name: string;
}
