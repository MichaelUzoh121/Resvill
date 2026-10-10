import api from "./api";

export const getGuestOrderTracking = async (
  orderNumber,
  trackingToken,
) => {
  const response = await api.get(
    `/tracking/${encodeURIComponent(orderNumber)}`,
    {
      params: {
        token: trackingToken,
      },
    },
  );

  return response.data;
};

export const getOrderTracking = async (
  orderId,
) => {
  const response = await api.get(
    `/orders/${orderId}/status`,
  );

  return response.data;
};