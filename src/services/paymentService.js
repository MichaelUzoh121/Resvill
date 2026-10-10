import api from "./api";

export const initializePayment = async ({
  orderId,
  orderNumber,
  trackingToken,
}) => {
  const response = await api.post(
    "/payments/initialize",
    {
      ...(orderId ? { orderId } : {}),
      ...(orderNumber ? { orderNumber } : {}),
      ...(trackingToken ? { trackingToken } : {}),
    },
  );

  return response.data;
};

export const verifyPayment = async ({
  reference,
  orderNumber,
  trackingToken,
}) => {
  const response = await api.post(
    "/payments/verify",
    {
      reference,
      ...(orderNumber ? { orderNumber } : {}),
      ...(trackingToken ? { trackingToken } : {}),
    },
  );

  return response.data;
};
