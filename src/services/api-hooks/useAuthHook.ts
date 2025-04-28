import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegister, IUser, ApiResponse } from "../../types";
import { getProfile, register } from "../APIs/auth";

export const useRegisterUser = () => {
  return useMutation<ApiResponse<IRegister> | undefined, Error, IRegister>({
    mutationFn: register,
  });
};

export const useFetchProfile = () => {
  return useQuery<ApiResponse<Partial<IUser>>, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
