import axios from "axios";
import { attachRequestInterceptor } from "./interceptors/requestInterceptor";
import { attachResponseInterceptor } from "./interceptors/responseInterceptor";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
});

attachRequestInterceptor(api);
attachResponseInterceptor(api);
