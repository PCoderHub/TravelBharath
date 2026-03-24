export const handleError = (error) => {
  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timed out. Please try again.",
      status: 408,
    };
  }
  return {
    message:
      error.response?.data?.message || error.message || "Something went wrong",
    status: error.response?.status,
    isAuthError: error.response?.status === 401,
  };
};
