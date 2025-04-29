import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegister, IUser, ApiResponse } from "../../types";
import { getProfile, login, register } from "../APIs/auth";

export const useRegisterUser = () => {
  return useMutation<ApiResponse<IRegister> | undefined, Error, IRegister>({
    mutationFn: register,
  });
};
export const useLoginMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IRegister>> | undefined,
    variables: { email: string; password: string },
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<{email : string , password  : string}>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<{ email: string; password: string }> | undefined,
    Error,
    { email: string; password: string }
  >({
    mutationFn: login,
    onSuccess,
    onError,
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
