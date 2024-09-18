import axios from "axios"
import { store } from "./store";

export const apiClient = axios.create({
    baseURL: `${ import.meta.env.VITE_API_URL }/api`,
    headers: {
      "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use((config) => {
  if (store.getState().authData.tokenData.access_token) {
    config.headers["Authorization"] = `Bearer ${store.getState().authData.tokenData.access_token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

apiClient.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

export default apiClient;