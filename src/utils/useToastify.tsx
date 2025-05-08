/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "./Loaders";
import { SuccessIcon } from "../components/svgs";
import { ErrorIcon } from "../icons/svgs";

type ToastType = boolean | "info" | "success" | "error" | undefined;
type ToastOptions = {
  [key: string]: number | boolean | string | undefined;
};

interface ToastContextType {
  showAlert: (
    toastId: number | string,
    message: string,
    type: ToastType,
    rest?: ToastOptions
  ) => string | number | undefined;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAlert must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children?: ReactNode }) => {
  const showAlert = useCallback(
    (
      toastId: number | string,
      message: string,
      type: ToastType,
      rest: ToastOptions = {}
    ) => {
      const toastType =
        type === "info" ? "info" : type === true ? "success" : "error";


        const icon =
          type === "info" ? (
            <Spinner />
          ) : type === true ? (
            <SuccessIcon />
          ) : (
            <ErrorIcon />
          );
      if (toastId) {
        toast.update(toastId, {
          render: message,
          type: toastType,
          icon, // Set to your icon component
          ...rest,
        });
        return undefined;
      }

      return toast(message, {
        type: toastType,
        icon, // Set to your icon component
        ...rest,
      });
    },
    []
  );

  const contextValue = useMemo(() => ({ showAlert }), [showAlert]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme="dark"
      />
    </ToastContext.Provider>
  );
};
