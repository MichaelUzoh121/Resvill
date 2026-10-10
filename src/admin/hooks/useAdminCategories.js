import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminCategories,
  getAdminCategoryDetails,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../services/adminService";

export const useAdminCategories = (
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useAdminCategoryDetails = (
  categoryId,
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-category", categoryId],
    queryFn: () =>
      getAdminCategoryDetails(categoryId),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useCreateAdminCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
      });
    },
  });
};

export const useUpdateAdminCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      categoryData,
    }) =>
      updateAdminCategory(
        categoryId,
        categoryData
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "admin-category",
          variables.categoryId,
        ],
      });
    },
  });
};

export const useDeleteAdminCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-categories"],
      });
    },
  });
};