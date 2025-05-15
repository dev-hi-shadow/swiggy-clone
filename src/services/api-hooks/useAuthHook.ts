import { useMutation, useQuery } from "@tanstack/react-query";
import { IRegister, IUser, ApiResponse } from "../../types";
import { getProfile, login, register } from "../APIs/auth";
import { queryClient } from "../QueryClient";

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
    data: (ApiResponse<Partial<IUser>> & { token: string }) | undefined,
    variables: { email: string; password: string },
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<{ email: string; password: string }>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  const mutation = useMutation<
    (ApiResponse<Partial<IUser>> & { token: string }) | undefined,
    Error,
    { email: string; password: string }
  >({
    mutationFn: login,
    onSuccess,
    onError,
  });
  return mutation;
};

export const useFetchProfile = () => {
  return useQuery<ApiResponse<Partial<IUser>>, Error>({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useLogout = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => Promise<void> | void;
  onError?: () => Promise<void> | void;
}) => {
  return useMutation<void>({
    mutationFn: async () => {
      queryClient.removeQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["profile"] });
      queryClient.removeQueries({ queryKey: ["activeRestaurant"] });
      queryClient.removeQueries({ queryKey: ["activeRBranch"] });
      localStorage.removeItem("authToken");
    },
    onSuccess,
    onError,
  });
};
