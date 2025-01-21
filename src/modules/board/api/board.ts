import { apiClient, ApiResponse } from 'modules/core/apiClient';
import { AxiosResponse } from 'axios';
import { ValidationError } from '@/modules/core/errors/errors';
import { KanbanBoardDto, BoardDto } from './dto';
import { dtoToBoard, dtoToColumns, dtoToTasks } from './transform';

interface UpdateBoardRequest {
  name: string;
  color: string;
}

interface CreateBoardRequest extends UpdateBoardRequest {
  workspace_id: number;
}

const index = async (id: string) => {
  const response: AxiosResponse<ApiResponse<KanbanBoardDto>> =
    await apiClient.get(`/boards/${id}`);

  const apiResponse: ApiResponse<KanbanBoardDto> = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || 'wiadomosc z frontu');
  }

  return {
    board: dtoToBoard(apiResponse.data),
    columns: dtoToColumns(apiResponse.data),
    tasks: dtoToTasks(apiResponse.data),
  };
};

const store = async (payload: CreateBoardRequest) => {
  const response = await apiClient.post('/board/store', payload);

  const apiResponse: ApiResponse<BoardDto> = response.data;

  if (!apiResponse.success && apiResponse.invalidFields) {
    throw new ValidationError(apiResponse.message, apiResponse.invalidFields);
  }

  return dtoToBoard(apiResponse.data);
};

const update = async (board_id: number, payload: UpdateBoardRequest) => {
  const response = await apiClient.post(`/board/${board_id}/update`, payload);

  const apiResponse: ApiResponse<BoardDto> = response.data;

  if (!apiResponse.success && apiResponse.invalidFields) {
    throw new ValidationError(apiResponse.message, apiResponse.invalidFields);
  }

  return dtoToBoard(apiResponse.data);
};

export default {
  index,
  store,
  update,
};
