import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAdminDeliveryOverview,
  getAdminDrivers,
  getAdminDriverDetails,
  getAdminDeliveries,
  getAdminDeliveryDetails,
  getAdminDeliveryHistory,
  getAdminDriverLocation,
  getAdminDeliveryETA,
  getAdminDeliveryByOrder,
  assignAdminDelivery,
  reassignAdminDelivery,
} from "../services/adminService";

// ======================================================
// DELIVERY OVERVIEW
// ======================================================

export const useAdminDeliveryOverview = (options = {}) => {
  return useQuery({
    queryKey: ["admin-delivery-overview"],
    queryFn: getAdminDeliveryOverview,
    staleTime: 60 * 1000,
    ...options,
  });
};

// ======================================================
// DRIVERS
// ======================================================

export const useAdminDrivers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-drivers", params],
    queryFn: () => getAdminDrivers(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

export const useAdminDriver = (driverId, options = {}) => {
  return useQuery({
    queryKey: ["admin-driver", driverId],
    queryFn: () => getAdminDriverDetails(driverId),
    enabled: Boolean(driverId),
    ...options,
  });
};

// ======================================================
// DELIVERIES
// ======================================================

export const useAdminDeliveries = (
  params = {},
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-deliveries", params],
    queryFn: () => getAdminDeliveries(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

export const useAdminDelivery = (
  deliveryId,
  options = {}
) => {
  return useQuery({
    queryKey: ["admin-delivery", deliveryId],
    queryFn: () => getAdminDeliveryDetails(deliveryId),
    enabled: Boolean(deliveryId),
    ...options,
  });
};

// ======================================================
// DELIVERY HISTORY
// ======================================================

export const useAdminDeliveryHistory = (
  deliveryId,
  options = {}
) => {
  return useQuery({
    queryKey: [
      "admin-delivery-history",
      deliveryId,
    ],
    queryFn: () =>
      getAdminDeliveryHistory(deliveryId),
    enabled: Boolean(deliveryId),
    ...options,
  });
};

// ======================================================
// DRIVER LOCATION
// ======================================================

export const useAdminDriverLocation = (
  deliveryId,
  options = {}
) => {
  return useQuery({
    queryKey: [
      "admin-driver-location",
      deliveryId,
    ],
    queryFn: () =>
      getAdminDriverLocation(deliveryId),
    enabled: Boolean(deliveryId),
    refetchInterval: 30 * 1000,
    ...options,
  });
};

// ======================================================
// DELIVERY ETA
// ======================================================

export const useAdminDeliveryETA = (
  deliveryId,
  options = {}
) => {
  return useQuery({
    queryKey: [
      "admin-delivery-eta",
      deliveryId,
    ],
    queryFn: () =>
      getAdminDeliveryETA(deliveryId),
    enabled: Boolean(deliveryId),
    refetchInterval: 60 * 1000,
    ...options,
  });
};

// ======================================================
// ASSIGN DRIVER
// ======================================================

export const useAssignAdminDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deliveryId,
      driverId,
    }) =>
      assignAdminDelivery(
        deliveryId,
        driverId
      ),

    onSuccess: (_, variables) => {
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
// REASSIGN DRIVER
// ======================================================

export const useReassignAdminDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deliveryId,
      driverId,
    }) =>
      reassignAdminDelivery(
        deliveryId,
        driverId
      ),

    onSuccess: (_, variables) => {
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

export const useAdminDeliveryByOrder = (orderId, options = {}) => {
  return useQuery({
    queryKey: ["admin-delivery-by-order", orderId],
    queryFn: () => getAdminDeliveryByOrder(orderId),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
    ...options,
  });
};