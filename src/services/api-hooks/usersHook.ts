import { useMutation, useQuery } from "@tanstack/react-query";
import type { IUser, ApiResponse } from "../../types";
import { getUserDetails, getUsers, updateUser } from "../APIs/users";
import { queryClient } from "../QueryClient";

export const useUpdateUser = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IUser>> | undefined,
    variables: Partial<IUser>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IUser>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IUser>> | undefined,
    Error,
    Partial<IUser>
  >({
    mutationFn: updateUser,
    onSuccess,
    onError,
  });
};

export const useGetUserDetails = () => {
  return useQuery<ApiResponse<Partial<IUser>>, Error>({
    queryKey: ["getUserDetails"],
    queryFn: getUserDetails,
    staleTime: Infinity,
  });
};

export const useGetUsers = () => {
  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<IUser>>;
    }>
  >({
    queryKey: ["getUsers"],
    queryFn: getUsers,
    staleTime: Infinity,
  });
};

export const useSwitchToAdmin = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => Promise<void> | void;
  onError?: () => Promise<void> | void;
}) => {
  return useMutation<void>({
    mutationFn: async () => {
      queryClient.removeQueries({ queryKey: ["activeRestaurant"] });
      queryClient.removeQueries({ queryKey: ["activeRBranch"] });
    },
    onSuccess,
    onError,
  });
};
