import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, IActiveRBranch, IRBranch } from "../../types";
import { createRBranch, getRBranch, getRBranches, updateRBranch } from "../APIs/branches";
import { queryClient } from "../QueryClient";

export const useGetRBranches = (restaurant_id: number) => {
  return useQuery<ApiResponse<Array<Partial<IRBranch>>>, Error>({
    queryKey: ["getRBranches"],
    queryFn: () => getRBranches(restaurant_id),
    enabled: !!restaurant_id,
  });
};
export const useGetRBranch = (id: number) => {
  return useQuery<ApiResponse<Partial<IRBranch>>, Error>({
    queryKey: ["getRBranch"],
    queryFn: () => getRBranch(id),
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

export const useActiveRBranch = () => {
  const query = useQuery<IActiveRBranch | undefined>({
    queryKey: ["activeRBranch"],
    initialData: undefined,
    queryFn: () =>
      queryClient.getQueryData<IActiveRBranch>(["activeRBranch"]) || {
        id: 0,
        location: "",
        orderAccepting: false,
        dayOff: false,
      },
    staleTime: Infinity,
  });

  const toggleAccepting = () => {
    queryClient.setQueryData<IActiveRBranch>(["activeRBranch"], (prev) => {
      if (!prev) return prev;
      return { ...prev, orderAccepting: !prev.orderAccepting };
    });
  };

  const toggleDayOff = () => {
    queryClient.setQueryData<IActiveRBranch>(["activeRBranch"], (prev) => {
      if (!prev) return prev;
      return { ...prev, dayOff: !prev.dayOff };
    });
  };

  return {
    ...query,
    toggleAccepting,
    toggleDayOff,
  };
};

