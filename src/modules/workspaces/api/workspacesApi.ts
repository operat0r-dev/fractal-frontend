import apiClient from '@/apiClient';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { ApiWorkspace } from '../types/apiTypes';
import { AccessForbiddenError } from '@/modules/core/errors/errors';
import { ApiUser } from '@/modules/users/types/apiTypes';

type CreateWorkspaceRequest = {
  name: string;
};

export function useWorkspacesApi() {
  const createWorkspace = async (payload: CreateWorkspaceRequest) => {
    const response: AxiosResponse<ApiResponse<ApiWorkspace>> =
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

  const updateWorkspace = async (
    id: string,
    payload: Partial<CreateWorkspaceRequest>
  ) => {
    const response: AxiosResponse<ApiResponse<ApiWorkspace>> =
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

  const getUserWorkspaces = async () => {
    const response: AxiosResponse<ApiResponse<ApiWorkspace[]>> =
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

  const getWorkspace = async (id: string) => {
    const response: AxiosResponse<ApiResponse<ApiWorkspace>> =
      await apiClient.get(`/workspace/${id}`);

    const apiResponse = response.data;

    if (!apiResponse.success) {
      throw new AccessForbiddenError(
        apiResponse.message || 'wiadomosc z frontu'
      );
    }

    return apiResponse.data;
  };

  const inviteUsers = async (id: string, payload: { ids: number[] }) => {
    const response: AxiosResponse<ApiResponse<[]>> = await apiClient.post(
      `/workspace/${id}/invite`,
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

  const getWorkspaceUsers = async (id: string) => {
    const response: AxiosResponse<ApiResponse<ApiUser[]>> = await apiClient.get(
      `/workspace/${id}/users`
    );

    const apiResponse: ApiResponse<ApiUser[]> = response.data;

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'wiadomosc z frontu');
    }

    return apiResponse.data;
  };

  return {
    createWorkspace,
    updateWorkspace,
    getUserWorkspaces,
    getWorkspace,
    inviteUsers,
    getWorkspaceUsers,
  };
}
