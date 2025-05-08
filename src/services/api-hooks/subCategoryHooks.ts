import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, ISubCategory } from "../../types";
  
import { createSubCategory, getSubCategories, getSubCategory, updateSubCategory } from "../APIs/subCategory";

export const useGetSubCategories = (category_id: number) => {
 

  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<ISubCategory>>;
    }>,
    Error
  >({
    queryKey: ["getCategories", { category_id }],
    queryFn: ({ queryKey }) => {
      const [, { category_id }] = queryKey as [string, { category_id: number }];
      return getSubCategories(category_id);
    },
    staleTime: Infinity,
    enabled: !!category_id,
  });
};
export const useGetSubCategory = (id: number) => {

  return useQuery<ApiResponse<Partial<ISubCategory>>, Error>({
    queryKey: ["getSubCategory", { id }],
    queryFn: ({ queryKey }) => {
      const [, { id }] = queryKey as [string, { id: number }];
      return getSubCategory({ id });
    },
    staleTime: Infinity,
    enabled: !!id,
  });
};


export const useCreateSubCategoryMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<ISubCategory>> | undefined,
    variables: Partial<ISubCategory>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<ISubCategory>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<ISubCategory>> | undefined,
    Error,
    Partial<ISubCategory>
  >({
    mutationFn: createSubCategory,
    onSuccess,
    onError,
  });
};

export const useUpdateSubCategoryMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<ISubCategory>> | undefined,
    variables: Partial<ISubCategory>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<ISubCategory>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<ISubCategory>> | undefined,
    Error,
    Partial<ISubCategory>
  >({
    mutationFn: updateSubCategory,
    onSuccess,
    onError,
  });
};