import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { LabelDto } from '../api/dto';
import { TaskDto } from '@/modules/tasks/api/dto';

export interface CreateTaskLabelRequest {
  name: string;
  color: string;
  board_id: number;
}

export interface AssignLabelsRequest {
  label_ids: number[];
}

const index = async (id: string | number) => {
  const response: AxiosResponse<ApiResponse<LabelDto[]>> = await apiClient.get(
    `/label/${id}`
  );

  const apiResponse: ApiResponse<LabelDto[]> = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

const store = async (payload: CreateTaskLabelRequest) => {
  const response: AxiosResponse<ApiResponse<LabelDto>> = await apiClient.post(
    '/label/create',
    payload
  );

  const apiResponse: ApiResponse<LabelDto> = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

const update = async (
  id: string | number,
  payload: Partial<CreateTaskLabelRequest>
) => {
  const response: AxiosResponse<ApiResponse<LabelDto>> = await apiClient.patch(
    `/label/update/${id}`,
    payload
  );

  const apiResponse: ApiResponse<LabelDto> = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

const assign = async (id: number, payload: AssignLabelsRequest) => {
  const response: AxiosResponse<ApiResponse<TaskDto>> = await apiClient.post(
    `/label/${id}/assign`,
    payload
  );

  const apiResponse: ApiResponse<TaskDto> = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

export default {
  index,
  store,
  update,
  assign,
};
