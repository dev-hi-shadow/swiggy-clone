import { useQuery } from "@tanstack/react-query";
import { ApiResponse, IRestaurant } from "../../types";
import { getRestaurants } from "../APIs/restaurants";

export const useGetRestaurants = () => {
  return useQuery<ApiResponse<Partial<IRestaurant>>[], Error>({
    queryKey: ["getRestaurants"],
    queryFn: getRestaurants,
  });
};
