export interface ReduxBoard {
  id: number;
  name: string;
  description?: string;
  workspace_id: number;
  color: string;
}

export interface ReduxLabel {
  id: number;
  board_id: number;
  color: string;
  name: string;
}
