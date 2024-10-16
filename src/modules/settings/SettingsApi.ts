import apiClient from '@/apiClient';
import { User } from '@/modules/auth/interfaces/types';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/modules/auth/slices/auth';

export function useSettingsApi() {
  const dispatch = useAppDispatch();

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

    dispatch(setUser(apiResponse.data));
  };

  return { updateUser };
}
