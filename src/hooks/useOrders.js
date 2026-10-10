// import { useQuery } from "@tanstack/react-query";

// import { getOrders } from "../services/orderService";

// export const useOrders = ({
//   page = 1,
//   limit = 10,
// } = {}) => {
//   const ordersQuery = useQuery({
//     queryKey: ["orders", page, limit],
//     queryFn: () =>
//       getOrders({
//         page,
//         limit,
//       }),
//     staleTime: 1000 * 60 * 2,
//   });

//   const orders =
//     ordersQuery.data?.data?.orders || [];

//   const pagination =
//     ordersQuery.data?.data?.pagination || {};

//   return {
//     orders,
//     pagination,
//     isLoading: ordersQuery.isLoading,
//     isError: ordersQuery.isError,
//     refetchOrders: ordersQuery.refetch,
//   };
// };

import { useQuery } from "@tanstack/react-query";

import { getOrders, getOrderById } from "../services/orderService";

export const useOrders = ({ page = 1, limit = 10 } = {}) => {
  const ordersQuery = useQuery({
    queryKey: ["orders", page, limit],
    queryFn: () =>
      getOrders({
        page,
        limit,
      }),
    staleTime: 1000 * 60 * 2,
  });

  const orders = ordersQuery.data?.data?.orders || [];

  const pagination = ordersQuery.data?.data?.pagination || {};

  return {
    orders,
    pagination,
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    refetchOrders: ordersQuery.refetch,
  };
};

export const useOrder = (orderId) => {
  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: Boolean(orderId),
    staleTime: 1000 * 60 * 2,
  });

  // const order = orderQuery.data?.data?.order || orderQuery.data?.order || null;

  const order =
    orderQuery.data?.data?.order ||
    orderQuery.data?.data ||
    orderQuery.data?.order ||
    null;

  return {
    order,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    error: orderQuery.error,
    refetchOrder: orderQuery.refetch,
  };
};
