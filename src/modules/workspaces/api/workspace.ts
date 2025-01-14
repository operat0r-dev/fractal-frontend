import { apiClient, ApiResponse } from 'modules/core/apiClient';
import { AxiosResponse } from 'axios';
import { AccessForbiddenError } from '@/modules/core/errors/errors';
import { WorkspaceDto, CurrentWorkspaceDto } from './dto';
import { UserDto } from '@/modules/users/api/dto';
import {
  dtoToWorkspace,
  dtoToWorkspaceBoards,
  dtoToWorkspaceUsers,
} from './transform';

type CreateWorkspaceRequest = {
  name: string;
};

const store = async (payload: CreateWorkspaceRequest) => {
  const response: AxiosResponse<ApiResponse<WorkspaceDto>> =
    await apiClient.post('/workspace/create', payload);

  const apiResponse = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

const update = async (id: string, payload: Partial<CreateWorkspaceRequest>) => {
  const response: AxiosResponse<ApiResponse<WorkspaceDto>> =
    await apiClient.patch(`/workspace/update/${id}`, payload);

  const apiResponse = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

const getMany = async () => {
  const response: AxiosResponse<ApiResponse<WorkspaceDto[]>> =
    await apiClient.get('/user/workspaces');

  const apiResponse = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

const getOne = async (id: string) => {
  const response: AxiosResponse<ApiResponse<CurrentWorkspaceDto>> =
    await apiClient.get(`/workspace/${id}`);

  const apiResponse = response.data;

  if (!apiResponse.success) {
    throw new AccessForbiddenError(apiResponse.message || 'wiadomosc z frontu');
  }

  return {
    workspace: dtoToWorkspace(apiResponse.data),
    boards: dtoToWorkspaceBoards(apiResponse.data),
    users: dtoToWorkspaceUsers(apiResponse.data),
  };
};

const invite = async (id: string, payload: { ids: number[] }) => {
  const response: AxiosResponse<ApiResponse<[]>> = await apiClient.post(
    `/workspace/${id}/invite`,
    payload
  );

  const apiResponse = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

const getUsers = async (id: string) => {
  const response: AxiosResponse<ApiResponse<UserDto[]>> = await apiClient.get(
    `/workspace/${id}/users`
  );

  const apiResponse = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || 'wiadomosc z frontu');
  }

  return apiResponse.data;
};

export default {
  store,
  update,
  getOne,
  getMany,
  getUsers,
  invite,
};
