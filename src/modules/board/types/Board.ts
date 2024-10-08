import { ApiColumn } from './apiTypes';

export type CreateBoardRequest = {
  workspace_id: number;
  name: string;
};

export type BoardResponse = {
  id: number;
  name: string;
  workspace_id: number;
  columns: ApiColumn[];
};
