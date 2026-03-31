export const handleError = (error) => {
  if (error.code === "ECONNABORTED") {
    return {
      message: "Request timed out. Please try again.",
      status: 408,
    };
  }

  if (error.message && !error.response) {
    return {
      message: error.message,
      status: error.status || 500,
      isAuthError: false,
    };
  }

  return {
    message:
      error.response?.data?.message || error.message || "Something went wrong",
    status: error.response?.status,
    isAuthError: error.response?.status === 401,
  };
};
