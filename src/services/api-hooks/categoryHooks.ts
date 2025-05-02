import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ICategory } from "../../types";
import { queryClient } from "../QueryClient";
import { createCategory, getCategories, getCategory, updateCategory } from "../APIs/categories";

export const useGetCategories = () => {
  const initialData = queryClient.getQueryData<
    ApiResponse<{
      count: number;
      rows: Array<Partial<ICategory>>;
    }>
  >(["getCategories"]);

  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<ICategory>>;
    }>,
    Error
  >({
    queryKey: ["getCategories"],
    queryFn: getCategories,
    initialData,
  });
};
export const useGetCategory = (id: number) => {
  const initialData = queryClient.getQueryData<ApiResponse<Partial<ICategory>>>(
    ["getCategory"]
  );

  return useQuery<ApiResponse<Partial<ICategory>>, Error>({
    queryKey: ["getCategory", { id }],
    queryFn: ({ queryKey }) => {
      const [, { id }] = queryKey as [string, { id: number }];
      return getCategory({ id });
    },
    initialData,
  });
};


export const useCreateCategoryMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<ICategory>> | undefined,
    variables: Partial<ICategory>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<ICategory>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<ICategory>> | undefined,
    Error,
    Partial<ICategory>
  >({
    mutationFn: createCategory,
    onSuccess,
    onError,
  });
};

export const useUpdateCategoryMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<ICategory>> | undefined,
    variables: Partial<ICategory>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<ICategory>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<ICategory>> | undefined,
    Error,
    Partial<ICategory>
  >({
    mutationFn: updateCategory,
    onSuccess,
    onError,
  });
};