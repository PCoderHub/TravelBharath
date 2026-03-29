export const attachRequestInterceptor = (api) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};
