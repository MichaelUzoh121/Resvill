import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminReviews,
  getAdminReviewDetails,
  updateAdminReviewModeration,
} from "../services/adminService";

export const useAdminReviews = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-reviews", params],
    queryFn: () => getAdminReviews(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useAdminReview = (reviewId, options = {}) => {
  return useQuery({
    queryKey: ["admin-review", reviewId],
    queryFn: () => getAdminReviewDetails(reviewId),
    enabled: Boolean(reviewId),
    ...options,
  });
};

export const useUpdateAdminReviewModeration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, moderationData }) =>
      updateAdminReviewModeration(
        reviewId,
        moderationData
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-review", variables.reviewId],
      });
    },
  });
};