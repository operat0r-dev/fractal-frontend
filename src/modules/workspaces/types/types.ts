export type Workspace = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  boards: Board[];
};

export type Board = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  workspace_id: number;
};
