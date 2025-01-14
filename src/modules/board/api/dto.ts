import { TaskDto } from '@/modules/tasks/api/dto';

export interface BoardDto {
  id: number;
  name: string;
  workspace_id: number;
  color: string;
}

export interface KanbanBoardDto extends BoardDto {
  columns: ColumnDto[];
}

export interface ColumnDto {
  id: number;
  board_id: number;
  name: string;
  seq: number;
  tasks: TaskDto[];
  color: string;
}
