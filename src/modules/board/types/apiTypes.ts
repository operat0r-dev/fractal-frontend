import { ApiUser } from '@/modules/users/types/apiTypes';

export type ApiBoard = {
  id: number;
  name: string;
  workspace_id: number;
  columns: ApiColumn[];
  color: string;
};
export interface ApiColumn {
  id: number;
  board_id: number;
  name: string;
  seq: number;
  tasks: ApiTask[];
  color: string;
}

export interface ApiTask {
  id: number;
  column_id: number;
  title: string;
  seq: number;
  labels: ApiLabel[];
  user: ApiUser | null;
}

export interface ApiLabel {
  id: number;
  name: string;
  color: string;
  board_id: number;
  pivot: {
    task_id: number;
    label_id: number;
  };
}

export interface CreateColumnRequest {
  name: string;
  board_id: number;
  seq: number;
  color: string;
}

export interface CreateTaskRequest {
  title: string;
  column_id: number;
  seq: number;
}

export interface UpdateTaskRequest {
  column_id?: number;
  seq: number;
}
