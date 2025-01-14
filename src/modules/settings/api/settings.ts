import { apiClient, ApiResponse } from 'modules/core/apiClient';
import { User } from '@/modules/auth/interfaces/types';
import { AxiosResponse } from 'axios';

const updateUser = async (payload: Partial<User>) => {
  const response: AxiosResponse<ApiResponse<User>> = await apiClient.patch(
    '/update',
    payload
  );
  const apiResponse: ApiResponse<User> = response.data;

  if (!apiResponse.success) {
    if (!apiResponse.message) {
      throw new Error('wiadomosc z frontu');
    }

    throw new Error('wiadomosc z backu');
  }

  return apiResponse.data;
};

export default { updateUser };
