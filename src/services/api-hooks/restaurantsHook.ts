import { useMutation, useQuery, } from "@tanstack/react-query";
import { ApiResponse, IRestaurant, IActiveRestaurant, IPagination } from "../../types";
import {
  createRestaurant,
  getRestaurant,
  getRestaurants,
  updateRestaurant,
} from "../APIs/restaurants";
  
export const useGetRestaurants = (payload?: null | IPagination<IRestaurant>) => {
  return useQuery<ApiResponse<Array<Partial<IRestaurant>>>, Error>({
    queryKey: ["getRestaurants"],
    queryFn: () => getRestaurants(payload),
    staleTime: Infinity,
  });
};

export const useGetRestaurant = (id: number) => {
  return useQuery<ApiResponse<Partial<IRestaurant>>, Error>({
    queryKey: ["getRestaurant", { id }],
    queryFn: ({ queryKey }) => {
      const [, { id }] = queryKey as [string, { id: number }];
      return getRestaurant({ id });      
    },
    staleTime: Infinity,

  });
};

export const useCreateRestaurantMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IRestaurant>> | undefined,
    variables: Partial<IRestaurant>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IRestaurant>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IRestaurant>> | undefined,
    Error,
    Partial<IRestaurant>
  >({
    mutationFn: createRestaurant,
    onSuccess,
    onError,
  });
};
export const useUpdateRestaurantMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (
    data: ApiResponse<Partial<IRestaurant>> | undefined,
    variables: Partial<IRestaurant>,
    context: unknown
  ) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: Partial<IRestaurant>,
    context: unknown
  ) => Promise<void> | void;
}) => {
  return useMutation<
    ApiResponse<Partial<IRestaurant>> | undefined,
    Error,
    Partial<IRestaurant>
  >({
    mutationFn: updateRestaurant,
    onSuccess,
    onError,
  });
};

export const useActiveRestaurant = () => {
return useQuery<IActiveRestaurant | undefined>({
  queryKey: ["activeRestaurant"],
  initialData: undefined,
  staleTime: Infinity,
});


};

