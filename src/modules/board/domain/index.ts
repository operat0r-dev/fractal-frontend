export interface Board {
  id: number;
  name: string;
  workspace_id: number;
  color: string;
}

export interface Column {
  id: number;
  board_id: number;
  name: string;
  seq: number;
  tasks: number[];
  color: string;
}

export interface Task {
  id: number;
  column_id: number;
  title: string;
  seq: number;
  labels: number[];
  user_id: number | null;
}
