import { useMutation, useQuery } from "@tanstack/react-query";
import type { IUser, ApiResponse } from "../../types";
import { getUserDetails, updateUser } from "../APIs/users";

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
  });
};
