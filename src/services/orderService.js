// import api from "./api";

// export const createOrder = async (orderData) => {
//   const response = await api.post(
//     "/orders",
//     orderData
//   );

//   return response.data;
// };

// export const getOrders = async ({
//   page = 1,
//   limit = 10,
// } = {}) => {
//   const response = await api.get("/orders", {
//     params: {
//       page,
//       limit,
//     },
//   });

//   return response.data;
// };

import api from "./api";

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};

export const getOrders = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get("/orders", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);

  return response.data;
};

export const previewOrderPrice = async (orderData) => {
  const response = await api.post("/orders/preview-price", orderData);

  return response.data;
};
