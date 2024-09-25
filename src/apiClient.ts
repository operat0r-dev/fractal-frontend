import axios, { AxiosResponse } from 'axios';
import { store } from './store';
import { setTokenData, logout } from './modules/auth/slices/auth';
import { ApiResponse } from './types';
import { JWTTokenResponse } from './modules/auth/interfaces/types';
import { toast } from '@/hooks/use-toast';

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { tokenData } = store.getState().authData;

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

    return Promise.reject(error);
  }
);

export default apiClient;
