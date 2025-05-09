import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, IDish } from "../../types";
import { createDish, getDishById, getDishes, updateDish } from "../APIs/dishes";

export const useGetDishes = () => {
  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<IDish>>;
    }>,
    Error
  >({
    queryKey: ["getDishes"],
    queryFn: getDishes,
    staleTime: Infinity,
  });
};
export const useGetDish = (id: number) => {
  return useQuery<ApiResponse<Partial<IDish>>, Error>({
    queryKey: ["getDish", { id }],
    queryFn: ({ queryKey }) => {
      const [, { id }] = queryKey as [string, { id: number }];
      return getDishById({ id });
    },
    staleTime: Infinity,
    enabled: !!id,
  });
};


export const useCreateDishMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IDish>> | undefined,
    variables: Partial<IDish>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IDish>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IDish>> | undefined,
    Error,
    Partial<IDish>
  >({
    mutationFn: createDish,
    onSuccess,
    onError,
  });
};

export const useUpdateDishMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IDish>> | undefined,
    variables: Partial<IDish>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IDish>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IDish>> | undefined,
    Error,
    Partial<IDish>
  >({
    mutationFn: updateDish,
    onSuccess,
    onError,
  });
};