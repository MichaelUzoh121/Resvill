import api from "./api";

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await api.get("/reviews/my-reviews");
  return response.data;
};

export const getFoodReviews = async (foodId) => {
  const response = await api.get(`/foods/${foodId}/reviews`);

  return response.data;
};

export const getReviewById = async (reviewId) => {
  const response = await api.get(`/reviews/${reviewId}`);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.patch(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};