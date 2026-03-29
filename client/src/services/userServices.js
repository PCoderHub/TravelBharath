import { api } from "./api";
import { LOGIN, LOGOUT, REFRESH } from "../utils/urls";

export const userLogin = async ({ email, password }) => {
  const response = await api.post(LOGIN, { email, password });
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post(REFRESH, {
    refresh: localStorage.getItem("refresh"),
  });
  return response.data;
};

export const logoutUser = async () => {
  const refresh = localStorage.getItem("refresh");

  try {
    await api.post(LOGOUT, { refresh });
  } finally {
    localStorage.clear();
  }
};
