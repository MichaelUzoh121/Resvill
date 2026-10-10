import { useQuery } from "@tanstack/react-query";

import {
  getRecommendations,
} from "../services/recommendationService";

import { mapFoods } from "../utils/foodMapper";

export const useRecommendations = (
  { foodId, limit = 10 } = {},
  options = {}
) => {
  const recommendationsQuery = useQuery({
    queryKey: [
      "recommendations",
      { foodId, limit },
    ],
    queryFn: () =>
      getRecommendations({
        ...(foodId ? { foodId } : {}),
        limit,
      }),
    select: (response) => ({
      ...response,
      data: {
        ...response.data,
        recommendations: mapFoods(
          response.data?.recommendations || []
        ),
      },
    }),
    staleTime: 1000 * 60 * 5,
    ...options,
  });

  const recommendations =
    recommendationsQuery.data?.data?.recommendations || [];

  return {
    recommendations,
    isLoading: recommendationsQuery.isLoading,
    isError: recommendationsQuery.isError,
    error: recommendationsQuery.error,
    refetchRecommendations:
      recommendationsQuery.refetch,
  };
};