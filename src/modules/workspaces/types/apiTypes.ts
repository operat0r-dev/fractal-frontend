import { ApiUser } from '@/modules/users/types/apiTypes';

export type ApiWorkspace = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  boards: ApiWorkspaceBoard[];
  current: boolean;
  users: ApiUser[];
};

export type ApiWorkspaceBoard = {
  id: number;
  name: string;
  workspace_id: number;
  color: string;
};
