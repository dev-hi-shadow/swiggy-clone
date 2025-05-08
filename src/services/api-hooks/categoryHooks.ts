import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ICategory } from "../../types";
 import {
   createCategory,
   getCategories,
   getCategory,
   updateCategory,
 } from "../APIs/categories";

export const useGetCategories = () => {
  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<ICategory>>;
    }>,
    Error
  >({
    queryKey: ["getCategories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });
};
export const useGetCategory = (id: number) => {
 

  return useQuery<ApiResponse<Partial<ICategory>>, Error>({
    queryKey: ["getCategory", { id }],
    queryFn: ({ queryKey }) => {
      const [, { id }] = queryKey as [string, { id: number }];
      return getCategory({ id });
    },
    staleTime: Infinity,
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