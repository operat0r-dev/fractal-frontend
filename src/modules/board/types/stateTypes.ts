export interface ReduxColumn {
  id: number;
  board_id: number;
  name: string;
  seq: number;
  tasks: number[];
  color: string;
}

export interface ReduxTask {
  id: number;
  column_id: number;
  title: string;
  seq: number;
  labels: number[];
  user_id: number | null;
}
