import { api } from "./api";
import { LOGIN } from "../utils/urls";

export const userLogin = async ({ email, password }) => {
  const response = await api.post(LOGIN, { email, password });
  return response.data;
};
