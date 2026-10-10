import api from "./api";

export const getLoyalty = async () => {
  const response = await api.get("/loyalty");
  return response.data;
};

export const getLoyaltyTransactions = async (params = {}) => {
  const response = await api.get("/loyalty/transactions", {
    params,
  });

  return response.data;
};