import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
} from "../services/categoryService";

export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    ...options,
  });
};

export const useCategoryById = (id, options = {}) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
    ...options,
  });
};