import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { ApiUser } from '../types/apiTypes';

const useUsersApi = () => {
  const getUsers = async (query: string) => {
    const response: AxiosResponse<ApiResponse<ApiUser[]>> = await apiClient.get(
      `/users/email/${query}`
    );

    const apiResponse: ApiResponse<ApiUser[]> = response.data;

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
    getUsers,
    setUserWorkspace,
  };
};

export default useUsersApi;
