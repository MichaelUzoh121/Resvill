import api from "./api";

export const getRecommendations = async (params = {}) => {
  const response = await api.get("/recommendations", {
    params,
  });

  return response.data;
};