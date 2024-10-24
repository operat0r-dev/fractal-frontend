import { UserDto } from '@/modules/users/api/dto';
import { LabelDto } from '@/modules/labels/api/dto';

export interface TaskDto {
  id: number;
  column_id: number;
  title: string;
  seq: number;
  labels: LabelDto[];
  user: UserDto | null;
}
