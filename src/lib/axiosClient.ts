import axios from "axios";
import { getSession, signIn } from "next-auth/react";

const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const session = await getSession();

        if (session?.accessToken) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${session.accessToken}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${session.accessToken}`;

          return apiClient(originalRequest);
        } else {
          signIn();
        }
      } catch (refreshError) {
        console.error("Session refresh failed:", refreshError);
        signIn();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
