import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, IPagination, IRole } from "../../types";
 import { createRole, getRole, getRoles, updateRole } from "../APIs/roles";

export const useGetRoles = (payload?: null | IPagination<IRole>) => {
  return useQuery<ApiResponse<Array<Partial<IRole>>>, Error>({
    queryKey: ["getRoles"],
    queryFn: () => getRoles(payload),
    staleTime: Infinity,
  });
};
export const useGetRole = (id: number) => {
 
  return useQuery<ApiResponse<Partial<IRole>>, Error>({
    queryKey: ["getRole", { id }],
    queryFn: ({ queryKey }) => {
      const [, { id }] = queryKey as [string, { id: number }];
      return getRole({ id });
    },
    staleTime: Infinity,
    enabled: !!id,
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
