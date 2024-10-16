export type ApiWorkspace = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  boards: Board[];
  current: boolean;
  users: User[];
};

export type ApiBoard = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  workspace_id: number;
};

export interface ApiUser {
  id: number;
  email: string;
  name: string;
}
