import { useQuery } from "@tanstack/react-query";
import { getCurrentRestaurant } from "../services/restaurantService";

export const useCurrentRestaurant = (options = {}) => {
  return useQuery({
    queryKey: ["restaurant", "current"],
    queryFn: getCurrentRestaurant,
    staleTime: 1000 * 60 * 30,
    ...options,
  });
};