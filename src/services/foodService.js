import api from "./api";

export const getFoods = async (params = {}) => {
  const response = await api.get("/foods", {
    params,
  });

  return response.data;
};

export const getFoodById = async (id) => {
  const response = await api.get(`/foods/${id}`);

  return response.data;
};

export const getFoodBySlug = async (slug) => {
  const response = await api.get(`/foods/slug/${slug}`);

  return response.data;
};

export const getFoodReviews = async (foodId, params = {}) => {
  const response = await api.get(`/foods/${foodId}/reviews`, {
    params,
  });

  return response.data;
};