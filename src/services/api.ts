import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Auth0ContextInterface } from '@auth0/auth0-react';

let auth0Client: Auth0ContextInterface | undefined;

export const setAuth0Client = (client: Auth0ContextInterface): void => {
  auth0Client = client;
};

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
});

  // Request interceptor
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    if (auth0Client) {
      try {
        const token = await auth0Client.getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          },
        });
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          const payload = JSON.parse(atob(token.split('.')[1]));
          config.headers['org-id'] = payload.org_id;
        }
      } catch (error) {
        console.error('Failed to acquire token:', error);
      }
      }
      return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<AxiosError> => {
      if (error.response?.status === 401) {
        // Tránh vòng lặp chuyển hướng nếu trang login cũng gây ra lỗi 401
        if (!window.location.pathname.includes('/login')) {
          if (auth0Client) {
            // Nếu có Auth0 client, sử dụng nó để chuyển hướng đến trang đăng nhập Auth0.
            // appState sẽ giúp trả người dùng về đúng trang họ đang xem sau khi đăng nhập.
            auth0Client.loginWithRedirect({
              appState: { returnTo: window.location.pathname + window.location.search },
              authorizationParams: {
                organization: import.meta.env.VITE_AUTH0_ORG_ID,
              },
            });
          } else {
            // Phương án dự phòng: Chuyển hướng đến trang đăng nhập cũ
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );

export default api; 