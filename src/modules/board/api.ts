import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import {
  CreateColumnRequest,
  CreateTaskRequest,
  Column,
  Task,
} from './types/types';

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

  return {
    index,
    storeColumn,
    storeTask,
  };
};

export default useBoardApi;
