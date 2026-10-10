import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createReview,
  getMyReviews,
  getFoodReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../services/reviewService";

export const useFoodReviews = (foodId) => {
  const reviewsQuery = useQuery({
    queryKey: ["food-reviews", foodId],
    queryFn: () => getFoodReviews(foodId),
    enabled: Boolean(foodId),
    staleTime: 1000 * 60 * 5,
  });

  const reviews = reviewsQuery.data?.data?.reviews || [];

  const summary = reviewsQuery.data?.data?.summary || {
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  };

  return {
    reviews,
    summary,
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    refetchReviews: reviewsQuery.refetch,
  };
};

export const useMyReviews = () => {
  const reviewsQuery = useQuery({
    queryKey: ["my-reviews"],
    queryFn: getMyReviews,
    staleTime: 1000 * 60 * 5,
  });

  const reviews =
    reviewsQuery.data?.data?.reviews || reviewsQuery.data?.reviews || [];

  return {
    reviews,
    isLoading: reviewsQuery.isLoading,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    refetchReviews: reviewsQuery.refetch,
  };
};

export const useReview = (reviewId) => {
  const reviewQuery = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => getReviewById(reviewId),
    enabled: Boolean(reviewId),
  });

  const review =
    reviewQuery.data?.data?.review || reviewQuery.data?.review || null;

  return {
    review,
    isLoading: reviewQuery.isLoading,
    isError: reviewQuery.isError,
    error: reviewQuery.error,
    refetchReview: reviewQuery.refetch,
  };
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["food-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewData }) =>
      updateReview(reviewId, reviewData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["review", variables.reviewId],
      });

      queryClient.invalidateQueries({
        queryKey: ["food-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["food-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-reviews"],
      });
    },
  });
};
