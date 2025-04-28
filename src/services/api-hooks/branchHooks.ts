import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, IRBranch } from "../../types";
import { createRBranch, getRBranches, updateRBranch } from "../APIs/branches";

export const useGetRBranches = () => {
  return useQuery<ApiResponse<Array<Partial<IRBranch>>>, Error>({
    queryKey: ["getRBranches"],
    queryFn: getRBranches,
  });
};

export const useCreateRBranchMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IRBranch>> | undefined,
    variables: Partial<IRBranch>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IRBranch>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IRBranch>> | undefined,
    Error,
    Partial<IRBranch>
  >({
    mutationFn: createRBranch,
    onSuccess,
    onError,
  });
};

export const useUpdateRBranchMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IRBranch>> | undefined,
    variables: Partial<IRBranch>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IRBranch>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IRBranch>> | undefined,
    Error,
    Partial<IRBranch>
  >({
    mutationFn: updateRBranch,
    onSuccess,
    onError,
  });
};