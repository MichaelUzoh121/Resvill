import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminFoods,
  createAdminFood,
  getAdminFoodDetails,
  updateAdminFood,
  deleteAdminFood,
  updateAdminFoodAvailability,
  updateAdminFoodFeatured,
  updateAdminFoodPopular,
} from "../services/adminService";

export const useAdminFoods = (
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-foods", params],
    queryFn: () => getAdminFoods(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useCreateAdminFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminFood,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-foods"],
      });
    },
  });
};

export const useAdminFood = (foodId, options = {}) => {
  return useQuery({
    queryKey: ["admin-food", foodId],
    queryFn: () => getAdminFoodDetails(foodId),
    enabled: Boolean(foodId),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useUpdateAdminFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ foodId, foodData }) =>
      updateAdminFood(foodId, foodData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-foods"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-food", variables.foodId],
      });
    },
  });
};


export const useDeleteAdminFood = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminFood,

    onSuccess: (_, foodId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-foods"],
      });

      queryClient.removeQueries({
        queryKey: ["admin-food", foodId],
      });
    },
  });
};

export const useUpdateAdminFoodAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ foodId, available }) =>
      updateAdminFoodAvailability(foodId, available),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-foods"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-food", variables.foodId],
      });
    },
  });
};

export const useUpdateAdminFoodFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ foodId, featured }) =>
      updateAdminFoodFeatured(foodId, featured),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-foods"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-food", variables.foodId],
      });
    },
  });
};

export const useUpdateAdminFoodPopular = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ foodId, popular }) =>
      updateAdminFoodPopular(foodId, popular),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-foods"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-food", variables.foodId],
      });
    },
  });
};