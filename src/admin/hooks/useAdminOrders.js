import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminOrders,
  getAdminOrderDetails,
  updateAdminOrderStatus,
} from "../services/adminService";

import {
  assignAdminDelivery,
  reassignAdminDelivery,
} from "../services/adminService";

// ======================================================
// ORDERS
// ======================================================

export const useAdminOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getAdminOrders(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useAdminOrder = (orderId, options = {}) => {
  return useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: () => getAdminOrderDetails(orderId),
    enabled: Boolean(orderId),
    ...options,
  });
};

// ======================================================
// ORDER STATUS
// ======================================================

export const useUpdateAdminOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) =>
      updateAdminOrderStatus(orderId, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-order", variables.orderId],
      });
    },
  });
};

// ======================================================
// DELIVERY DRIVER ASSIGNMENT
// ======================================================

export const useAssignAdminDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deliveryId, driverId }) =>
      assignAdminDelivery(deliveryId, driverId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-delivery", variables.deliveryId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-delivery-overview"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-drivers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-driver"],
      });
    },
  });
};

// ======================================================
// DELIVERY DRIVER REASSIGNMENT
// ======================================================

export const useReassignAdminDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deliveryId, driverId }) =>
      reassignAdminDelivery(deliveryId, driverId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-delivery", variables.deliveryId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-delivery-overview"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-drivers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-driver"],
      });
    },
  });
};