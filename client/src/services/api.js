import axios from "axios";
import { handleError } from "../helpers/handleError";
export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleError(error)),
);
