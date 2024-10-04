import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import {
  CreateColumnRequest,
  CreateTaskRequest,
  Column,
  Task,
  BoardResponse,
  MoveTaskRequest,
  ReorderTaskRequest,
  CreateBoardRequest,
} from '@/modules/board/types/Board';
import { Board } from '@/modules/workspaces/types/types';

const useBoardApi = () => {
  const storeColumn = async (payload: CreateColumnRequest) => {
    const response: AxiosResponse<ApiResponse<Column>> = await apiClient.post(
      '/column/store',
      payload
    );

    const apiResponse: ApiResponse<Column> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const updateColumn = async (
    payload: Partial<CreateColumnRequest>,
    id: string
  ) => {
    const response: AxiosResponse<ApiResponse<Column>> = await apiClient.put(
      `/column/${id}`,
      payload
    );

    const apiResponse: ApiResponse<Column> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const storeBoard = async (payload: CreateBoardRequest) => {
    const response = await apiClient.post('/board/store', payload);

    const apiResponse: ApiResponse<Board> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const index = async (id: string) => {
    const response: AxiosResponse<ApiResponse<BoardResponse>> =
      await apiClient.get(`/boards/${id}`);

    const apiResponse: ApiResponse<BoardResponse> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const storeTask = async (payload: CreateTaskRequest) => {
    const response: AxiosResponse<ApiResponse<Task>> = await apiClient.post(
      '/task/store',
      payload
    );

    const apiResponse: ApiResponse<Task> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const moveTask = async (payload: MoveTaskRequest, id: string) => {
    const response: AxiosResponse<ApiResponse<[]>> = await apiClient.put(
      `/task/move/${id}`,
      payload
    );

    const apiResponse: ApiResponse<[]> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const reorderTask = async (payload: ReorderTaskRequest, id: string) => {
    const response: AxiosResponse<ApiResponse<[]>> = await apiClient.put(
      `/task/reorder/${id}`,
      payload
    );

    const apiResponse: ApiResponse<[]> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  return {
    index,
    storeColumn,
    storeTask,
    moveTask,
    reorderTask,
    updateColumn,
    storeBoard,
  };
};

export default useBoardApi;
