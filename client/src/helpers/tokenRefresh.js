import axios from "axios";

let isRefreshing = false;
let failedRequestsQueue = [];

export const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedRequestsQueue = [];
};

export const addToQueue = (resolve, reject) => {
  failedRequestsQueue.push({ resolve, reject });
};

export const getIsRefreshing = () => isRefreshing;
export const setIsRefreshing = (value) => {
  isRefreshing = value;
};

export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) throw new Error("Refresh token not available");

  const response = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/user/refresh`,
    { refresh },
  );

  const newAccessToken = response.data.access;
  localStorage.setItem("access", newAccessToken);
  return newAccessToken;
};

export const handleRefreshFailure = (error) => {
  localStorage.clear();
  window.location.href = "/admin";
  return error;
};
