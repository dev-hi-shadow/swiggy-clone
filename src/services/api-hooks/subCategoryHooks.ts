import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse, IPagination, ISubCategory } from "../../types";
  
import { createSubCategory, getSubCategories, getSubCategory, updateSubCategory } from "../APIs/subCategory";

export const useGetSubCategories = (
  payload?: null | IPagination<ISubCategory>
) => {
  console.log("🚀 ~ payload:", payload)
  return useQuery<
    ApiResponse<{
      count: number;
      rows: Array<Partial<ISubCategory>>;
    }>,
    Error
  >({
    queryKey: ["getSubCategories", payload],
    queryFn: ({ queryKey }) => {
      const [, payload] = queryKey as [
        string,
        { payload: IPagination<ISubCategory> }
      ];
      return getSubCategories(payload);
    },
    staleTime: Infinity,
    enabled: !!payload?.category_id,
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