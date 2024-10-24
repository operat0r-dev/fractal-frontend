import apiClient from '@/apiClient';
import { ApiResponse } from '@/types';
import { AxiosResponse } from 'axios';
import { UserDto } from './dto';

const getMany = async (query: string) => {
  const response: AxiosResponse<ApiResponse<UserDto[]>> = await apiClient.get(
    `/users/email/${query}`
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

const setWorkspace = async (id: number) => {
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

export default { getMany, setWorkspace };
