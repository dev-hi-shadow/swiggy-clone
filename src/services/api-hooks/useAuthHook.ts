import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegister, IUser, Response } from "../../types";
import { getProfile, register } from "../APIs/auth";

export const useRegisterUser = () => {
  return useMutation<Response<IRegister> | undefined, Error, IRegister>({
    mutationFn: register,
    onSuccess: (data) => {
      if (data?.success) {
        if (data.isToast) {
          console.log(data.message);
        }
      }
    },
    onError: (error: Error) => {
      console.error("Error creating user:", error);
    },
  });
};

export const useFetchProfile = () => {
  return useQuery<Response<Partial<IUser>>, Error, Partial<IUser>>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};
