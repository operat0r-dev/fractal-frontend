import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { BoardResponse, CreateBoardRequest } from '@/modules/board/types/Board';
import {
  CreateColumnRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiColumn,
  ApiTask,
} from '../types/apiTypes';
import { Board } from '@/modules/workspaces/types/types';

const useBoardApi = () => {
  const storeColumn = async (payload: CreateColumnRequest) => {
    const response: AxiosResponse<ApiResponse<ApiColumn>> =
      await apiClient.post('/column/store', payload);

    const apiResponse: ApiResponse<ApiColumn> = response.data;

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
    const response: AxiosResponse<ApiResponse<ApiColumn>> = await apiClient.put(
      `/column/${id}`,
      payload
    );

    const apiResponse: ApiResponse<ApiColumn> = response.data;

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
    const response: AxiosResponse<ApiResponse<ApiTask>> = await apiClient.post(
      '/task/store',
      payload
    );

    const apiResponse: ApiResponse<ApiTask> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const updateTask = async (
    id: number,
    payload: Partial<UpdateTaskRequest>
  ) => {
    const response: AxiosResponse<ApiResponse<[]>> = await apiClient.put(
      `/task/update/${id}`,
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
    updateTask,
    updateColumn,
    storeBoard,
  };
};

export default useBoardApi;
