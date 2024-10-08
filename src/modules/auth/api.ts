import apiClient from '@/apiClient';
import {
  RegisterRequest,
  LoginRequest,
  JWTTokenResponse,
  User,
} from './interfaces/types';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';
import { useAppDispatch } from '@/hooks';
import { setTokenData, setUser } from './slices/auth';

export function useAuthApi() {
  const dispatch = useAppDispatch();
  const login = async (payload: LoginRequest) => {
    const response: AxiosResponse<ApiResponse<JWTTokenResponse>> =
      await apiClient.post('/login', payload);
    const apiResponse: ApiResponse<JWTTokenResponse> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    dispatch(setTokenData(apiResponse.data));

    const userResponse = await getUser();
    dispatch(setUser(userResponse));

    return userResponse;
  };

  const register = async (values: RegisterRequest) => {
    const formData = new FormData();

    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('password_confirmation', values.password_confirmation);

    const response = await apiClient.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  };

  const getUser = async () => {
    const response: AxiosResponse<ApiResponse<User>> =
      await apiClient.get('/me');
    const apiResponse: ApiResponse<User> = response.data;

    if (!apiResponse.success) {
      if (!apiResponse.message) {
        throw new Error('wiadomosc z frontu');
      }

      throw new Error('wiadomosc z backu');
    }

    return apiResponse.data;
  };

  return {
    login,
    register,
  };
}
