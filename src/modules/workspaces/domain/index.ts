export interface Workspace {
  id: number;
  name: string;
  description?: string;
  current: boolean;
}

export interface CurrentWorkspace extends Workspace {
  users: number[];
  boards: number[];
}
