import { createContext } from "react";
import toast from "react-hot-toast";
const ErrorContext = createContext();

export function ErrorProvider({ children }) {
  const notifyError = (msg) => {
    toast.error(msg);
  };

  const notifySuccess = (msg) => {
    toast.success(msg);
  };

  const notifyPromise = (prom, messages = {}) => {
    return toast.promise(prom, {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success",
      error: (err) => err.message || "Something went wrong",
    });
  };

  return (
    <ErrorContext.Provider
      value={{ notifyError, notifySuccess, notifyPromise }}
    >
      {children}
    </ErrorContext.Provider>
  );
}

export default ErrorContext;
