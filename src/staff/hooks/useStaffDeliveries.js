import { useQuery } from "@tanstack/react-query";
import {
  getOrderDelivery,
  getDeliveryById,
  getDeliveryHistory,
} from "../services/staffService";

export const useStaffOrderDelivery = (orderId) => {
  return useQuery({
    queryKey: ["staff", "deliveries", "order", orderId],
    queryFn: () => getOrderDelivery(orderId),
    enabled: Boolean(orderId),
    staleTime: 15 * 1000,
  });
};

export const useStaffDelivery = (deliveryId) => {
  return useQuery({
    queryKey: ["staff", "deliveries", deliveryId],
    queryFn: () => getDeliveryById(deliveryId),
    enabled: Boolean(deliveryId),
    staleTime: 15 * 1000,
  });
};

export const useStaffDeliveryHistory = (deliveryId) => {
  return useQuery({
    queryKey: ["staff", "deliveries", deliveryId, "history"],
    queryFn: () => getDeliveryHistory(deliveryId),
    enabled: Boolean(deliveryId),
    staleTime: 30 * 1000,
  });
};

