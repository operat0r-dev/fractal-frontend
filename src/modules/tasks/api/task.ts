import { AxiosResponse } from 'axios';
import { apiClient, ApiResponse } from 'modules/core/apiClient';
import { TaskDto } from './dto';
import { dtoToTask, dtoToLabels } from './transform';

export interface CreateTaskRequest {
  title: string;
  column_id: number;
  seq: number;
}

export interface UpdateTaskRequest {
  column_id?: number;
  seq: number;
}

const store = async (payload: CreateTaskRequest) => {
  const response: AxiosResponse<ApiResponse<TaskDto>> = await apiClient.post(
    '/task/store',
    payload
  );

  const apiResponse: ApiResponse<TaskDto> = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || 'wiadomosc z frontu');
  }

  return apiResponse.data;
};

const update = async (id: number, payload: Partial<UpdateTaskRequest>) => {
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

const getOne = async (id: string) => {
  const response: AxiosResponse<ApiResponse<TaskDto>> = await apiClient.get(
    `/task/${id}`
  );

  const apiResponse: ApiResponse<TaskDto> = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || 'wiadomosc z frontu');
  }

  return {
    task: dtoToTask(apiResponse.data),
    labels: dtoToLabels(apiResponse.data),
  };
};

const assignUser = async (id: number, payload: { user_id: number | null }) => {
  const response: AxiosResponse<ApiResponse<TaskDto>> = await apiClient.put(
    `/task/${id}/assign-user`,
    payload
  );

  const apiResponse: ApiResponse<TaskDto> = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || 'wiadomosc z frontu');
  }

  return apiResponse.data;
};

export default {
  getOne,
  store,
  update,
  assignUser,
};
