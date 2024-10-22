import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { CreateBoardRequest } from '@/modules/board/types/Board';
import {
  CreateColumnRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiColumn,
  ApiTask,
  ApiBoard,
} from '../types/apiTypes';
import { ValidationError } from '@/modules/core/errors/errors';

const useBoardApi = () => {
  const storeColumn = async (payload: CreateColumnRequest) => {
    const response: AxiosResponse<ApiResponse<ApiColumn>> =
      await apiClient.post('/column/store', payload);

    const apiResponse: ApiResponse<ApiColumn> = response.data;

    if (!apiResponse.success && apiResponse.invalidFields) {
      throw new ValidationError(apiResponse.message, apiResponse.invalidFields);
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
      throw new Error(apiResponse.message || 'wiadomosc z frontu');
    }

    return apiResponse.data;
  };

  const storeBoard = async (payload: CreateBoardRequest) => {
    const response = await apiClient.post('/board/store', payload);

    const apiResponse: ApiResponse<ApiBoard> = response.data;

    if (!apiResponse.success && apiResponse.invalidFields) {
      throw new ValidationError(apiResponse.message, apiResponse.invalidFields);
    }

    return apiResponse.data;
  };

  const index = async (id: string) => {
    const response: AxiosResponse<ApiResponse<ApiBoard>> = await apiClient.get(
      `/boards/${id}`
    );

    const apiResponse: ApiResponse<ApiBoard> = response.data;

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'wiadomosc z frontu');
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
      throw new Error(apiResponse.message || 'wiadomosc z frontu');
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
      throw new Error(apiResponse.message || 'wiadomosc z frontu');
    }

    return apiResponse.data;
  };

  const assignUser = async (
    id: number,
    payload: { user_id: number | null }
  ) => {
    const response: AxiosResponse<ApiResponse<ApiTask>> = await apiClient.put(
      `/task/${id}/assign-user`,
      payload
    );

    const apiResponse: ApiResponse<ApiTask> = response.data;

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'wiadomosc z frontu');
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
    assignUser,
  };
};

export default useBoardApi;
