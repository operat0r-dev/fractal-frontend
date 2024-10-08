export interface CreateTaskLabelRequest {
  name: string;
  color: string;
  board_id: number;
}

export interface AssignLabelsRequest {
  label_ids: number[];
}
