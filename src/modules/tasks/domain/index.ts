export interface Task {
  id: number;
  column_id: number;
  title: string;
  seq: number;
  label_ids: number[];
  user_id: number | null;
}
