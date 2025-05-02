import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, IRole } from "../../types";
import { queryClient } from "../QueryClient";
import { createRole, getRole, getRoles, updateRole } from "../APIs/roles";

export const useGetRoles = () => {
  const initialData = queryClient.getQueryData<
    ApiResponse<Array<Partial<IRole>>>
  >(["getRoles"]);

  return useQuery<ApiResponse<Array<Partial<IRole>>>, Error>({
    queryKey: ["getRoles"],
    queryFn: getRoles,
    initialData,
  });
};
export const useGetRole = (id: number) => {
  const initialData = queryClient.getQueryData<ApiResponse<Partial<IRole>>>([
    "getRole",
  ]);

  return useQuery<ApiResponse<Partial<IRole>>, Error>({
    queryKey: ["getRole", { id }],
    queryFn: ({ queryKey }) => {
      const [, { id }] = queryKey as [string, { id: number }];
      return getRole({ id });
    },
    initialData,
  });
};

export const useCreateRoleMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IRole>> | undefined,
    variables: Partial<IRole>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IRole>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IRole>> | undefined,
    Error,
    Partial<IRole>
  >({
    mutationFn: createRole,
    onSuccess,
    onError,
  });
};

export const useUpdateRoleMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IRole>> | undefined,
    variables: Partial<IRole>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IRole>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IRole>> | undefined,
    Error,
    Partial<IRole>
  >({
    mutationFn: updateRole,
    onSuccess,
    onError,
  });
};
