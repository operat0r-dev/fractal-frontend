export type CreateColumnRequest = {
  name: string;
  board_id: number;
  seq: number;
  color: string;
};

export type Column = {
  id: number;
  board_id: number;
  name: string;
  seq: number;
  created_at: string;
  updated_at: string;
  tasks: Task[];
  color: string;
};

export type CreateTaskRequest = {
  title: string;
  column_id: number;
  seq: number;
};

export type Task = {
  id: number;
  column_id: number;
  title: string;
  seq: number;
  created_at: string;
  updated_at: string;
};

export type CreateBoardRequest = {
  workspace_id: number;
  name: string;
};

export type BoardResponse = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  workspace_id: number;
  columns: Column[];
};

export type MoveTaskRequest = {
  column_id: number;
  seq: number;
};

export type ReorderTaskRequest = {
  seq: number;
};
