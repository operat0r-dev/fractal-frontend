import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { CreateBoardRequest } from '@/modules/board/types/Board';
import { ValidationError } from '@/modules/core/errors/errors';
import { KanbanBoardDto, BoardDto } from './dto';
import { dtoToBoard, dtoToColumns, dtoToTasks } from './transform';

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

export default {
  index,
  store,
};
