import apiClient from '@/apiClient';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { Workspace } from '../types/types';

type CreateWorkspaceRequest = {
  name: string;
};

export function useWorkspacesApi() {
  const createWorkspace = async (payload: CreateWorkspaceRequest) => {
    const response: AxiosResponse<ApiResponse<Workspace>> =
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
    const response: AxiosResponse<ApiResponse<Workspace>> =
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
    const response: AxiosResponse<ApiResponse<Workspace[]>> =
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
    const response: AxiosResponse<ApiResponse<Workspace>> = await apiClient.get(
      `/workspace/${id}`
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

  const setUserWorkspace = async (id: number) => {
    const response: AxiosResponse<ApiResponse<[]>> = await apiClient.patch(
      '/user/set-user-workspace',
      { id }
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

  return {
    setUserWorkspace,
    createWorkspace,
    updateWorkspace,
    getUserWorkspaces,
    getWorkspace,
  };
}
