import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUser, ApiResponse } from "../../types";
import { getUserDetails, getUsers, updateUser } from "../APIs/users";

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
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData<ApiResponse<Partial<IUser>>>([
    "profile",
  ]);
  return useQuery<ApiResponse<Partial<IUser>>, Error>({
    queryKey: ["getUserDetails"],
    queryFn: getUserDetails,
    initialData: profile,
  });
};

export const useGetUsers = () => {
  const queryClient = useQueryClient();
  const initialData = queryClient.getQueryData<
    ApiResponse<{
      count: number;
      rows: Array<Partial<IUser>>;
    }>
  >(["getUsers"]);

  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<IUser>>;
    }>
  >({
    queryKey: ["getUsers"],
    queryFn: getUsers,
    initialData,
  });
};
