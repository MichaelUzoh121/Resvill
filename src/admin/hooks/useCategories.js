import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categoryService";

export const useCategories = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};