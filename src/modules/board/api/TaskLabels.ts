import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import type {
  CreateTaskLabelRequest,
  AssignLabelsRequest,
} from '../types/TaskLabel';
import { ApiTask, ApiLabel } from '../types/apiTypes';

const useLabelApi = () => {
  const storeLabel = async (payload: CreateTaskLabelRequest) => {
    const response: AxiosResponse<ApiResponse<ApiLabel>> = await apiClient.post(
      '/label/create',
      payload
    );

    const apiResponse: ApiResponse<ApiLabel> = response.data;

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
    const response: AxiosResponse<ApiResponse<ApiLabel>> =
      await apiClient.patch(`/label/update/${id}`, payload);

    const apiResponse: ApiResponse<ApiLabel> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const index = async (id: string) => {
    const response: AxiosResponse<ApiResponse<ApiLabel[]>> =
      await apiClient.get(`/label/${id}`);

    const apiResponse: ApiResponse<ApiLabel[]> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  const assignLabels = async (id: number, payload: AssignLabelsRequest) => {
    const response: AxiosResponse<ApiResponse<ApiTask>> = await apiClient.post(
      `/label/${id}/assign`,
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

  return {
    index,
    storeLabel,
    updateLabel,
    assignLabels,
  };
};

export default useLabelApi;
