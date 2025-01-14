import axios, { AxiosResponse } from 'axios';
import { store } from '@/store/store';
import { setTokenData, logout } from 'modules/auth/slices/auth';
import { JWTTokenResponse } from 'modules/auth/interfaces/types';
import { toast } from '@/hooks/use-toast';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  invalidFields?: { [key: string]: string[] };
}

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_URL_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { tokenData } = store.getState().auth;

    if (tokenData) {
      config.headers['Authorization'] = `Bearer ${tokenData.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response: AxiosResponse<ApiResponse<JWTTokenResponse>> =
          await apiClient.post('/refresh-token');

        const apiResponse: ApiResponse<JWTTokenResponse> = response.data;
        store.dispatch(setTokenData(apiResponse.data));

        originalRequest.headers['Authorization'] =
          `Bearer ${apiResponse.data.access_token}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    } else if (error.status === 401 && originalRequest._retry) {
      store.dispatch(logout());
      toast({
        variant: 'destructive',
        description: 'Session expired. Please login in order to continue.',
      });
    }

    return error.response;
  }
);
