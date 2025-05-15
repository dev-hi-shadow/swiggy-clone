import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ICategory, IDish, IPagination } from "../../types";
import { createDish, getDishById, getDishes, getDishesByCategory, updateDish } from "../APIs/dishes";

export const useGetDishes = (payload?: null | IPagination<IDish>) => {
  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<IDish>>;
    }>,
    Error
  >({
    queryKey: ["getDishes"],
    queryFn: () => getDishes(payload),
    staleTime: Infinity,
  });
};

export const useGetDishByCategory  = (payload?: null | IPagination<IDish>) => {
  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<ICategory>>;
    }>,
    Error
  >({
    queryKey: ["getDishes"],
    queryFn: () => getDishesByCategory(payload),
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