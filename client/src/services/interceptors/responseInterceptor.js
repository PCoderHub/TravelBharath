import { handleError } from "../../helpers/handleError";
import {
  addToQueue,
  getIsRefreshing,
  handleRefreshFailure,
  processQueue,
  refreshAccessToken,
  setIsRefreshing,
} from "../../helpers/tokenRefresh";

const AUTH_ROUTES = ["/user/login", "/user/refresh", "/user/logout"];

const isAuthRoute = (url) => AUTH_ROUTES.some((route) => url?.includes(route));

const retryWithNewToken = (api, originalRequest, token) => {
  originalRequest.headers.Authorization = `Bearer ${token}`;
  return api(originalRequest);
};

export const attachResponseInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const shouldRefresh =
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isAuthRoute(originalRequest.url);

      if (!shouldRefresh) return Promise.reject(handleError(error));

      if (getIsRefreshing()) {
        return new Promise((resolve, reject) => {
          addToQueue(resolve, reject);
        }).then((token) => retryWithNewToken(api, originalRequest, token));
      }

      originalRequest._retry = true;
      setIsRefreshing(true);

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        return retryWithNewToken(api, originalRequest, newToken);
      } catch (refreshError) {
        processQueue(refreshError, null);
        handleRefreshFailure(refreshError);
        return Promise.reject(handleError(refreshError));
      } finally {
        setIsRefreshing(false);
      }
    },
  );
};
