import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "../services/favoriteService";

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const favoritesQuery = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 1000 * 60 * 5,
  });

  const favorites =
    favoritesQuery.data?.data || [];

  const addMutation = useMutation({
    mutationFn: addFavorite,

    onSuccess: (response) => {
      queryClient.setQueryData(
        ["favorites"],
        response
      );

      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,

    onSuccess: (response) => {
      queryClient.setQueryData(
        ["favorites"],
        response
      );

      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });
    },
  });

  const useFavoriteStatus = (foodId) => {
    return useQuery({
      queryKey: ["favorite", foodId],
      queryFn: () => checkFavorite(foodId),
      enabled: Boolean(foodId),
      staleTime: 1000 * 60 * 5,
    });
  };

  return {
    favorites,

    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,

    refetchFavorites: favoritesQuery.refetch,

    addFavorite: addMutation.mutateAsync,
    addingFavorite: addMutation.isPending,

    removeFavorite: removeMutation.mutateAsync,
    removingFavorite: removeMutation.isPending,

    useFavoriteStatus,
  };
};
