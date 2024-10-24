import { UserDto } from '@/modules/users/api/dto';

export interface WorkspaceDto {
  id: number;
  name: string;
  description: string;
  current: boolean;
}

export interface WorkspaceBoardDto {
  id: number;
  name: string;
  workspace_id: number;
  color: string;
}

export interface CurrentWorkspaceDto extends WorkspaceDto {
  boards: WorkspaceBoardDto[];
  users: UserDto[];
}
