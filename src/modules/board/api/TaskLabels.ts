import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { BoardResponse } from '@/modules/board/types/Board';
import type { TaskLabel, CreateTaskLabelRequest } from '../types/TaskLabel';

const useLabelApi = () => {
  const storeLabel = async (payload: CreateTaskLabelRequest) => {
    const response: AxiosResponse<ApiResponse<TaskLabel>> =
      await apiClient.post('/label/create', payload);

    const apiResponse: ApiResponse<TaskLabel> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const updateLabel = async (
    payload: Partial<CreateTaskLabelRequest>,
    id: string
  ) => {
    const response: AxiosResponse<ApiResponse<TaskLabel>> =
      await apiClient.patch(`/label/update/${id}`, payload);

    const apiResponse: ApiResponse<TaskLabel> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const index = async (id: string) => {
    const response: AxiosResponse<ApiResponse<TaskLabel[]>> =
      await apiClient.get(`/label/${id}`);

    const apiResponse: ApiResponse<TaskLabel[]> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const assign = async (id: string) => {
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

  return {
    index,
    storeLabel,
    updateLabel,
    assign,
  };
};

export default useLabelApi;
