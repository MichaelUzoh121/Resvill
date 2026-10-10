import { useQuery } from "@tanstack/react-query";

import {
  getFoods,
  getFoodById,
  getFoodBySlug,
  // getFoodReviews,
} from "../services/foodService";

import { mapFoods, mapFood } from "../utils/foodMapper";

export const useFoods = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["foods", params],

    queryFn: () => getFoods(params),

    select: (response) => ({
      ...response,

      data: {
        ...response.data,

        foods: mapFoods(response.data?.foods),
      },
    }),

    ...options,
  });
};

export const useFoodById = (id, options = {}) => {
  return useQuery({
    queryKey: ["food", "id", id],

    queryFn: () => getFoodById(id),

    enabled: Boolean(id),

    select: (response) => ({
      ...response,

      data: {
        ...response.data,

        food: mapFood(response.data?.food),
      },
    }),

    ...options,
  });
};

export const useFoodBySlug = (slug, options = {}) => {
  return useQuery({
    queryKey: ["food", "slug", slug],

    queryFn: () => getFoodBySlug(slug),

    enabled: Boolean(slug),

    select: (response) => ({
      ...response,

      data: {
        ...response.data,

        food: mapFood(response.data?.food),
      },
    }),

    ...options,
  });
};