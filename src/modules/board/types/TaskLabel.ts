export type CreateTaskLabelRequest = {
  name: string;
  color: string;
  board_id: number;
};

export type TaskLabel = {
  id: number;
  name: string;
  color: string;
  board_id: number;
  created_at: string;
  updated_at: string;
};
