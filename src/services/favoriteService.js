import api from "./api";

export const getFavorites = async () => {
  const response = await api.get("/favorites");

  return response.data;
};

export const addFavorite = async (foodId) => {
  const response = await api.post(`/favorites/${foodId}`);

  return response.data;
};

export const removeFavorite = async (foodId) => {
  const response = await api.delete(`/favorites/${foodId}`);

  return response.data;
};

export const checkFavorite = async (foodId) => {
  const response = await api.get(`/favorites/${foodId}`);

  return response.data;
};

