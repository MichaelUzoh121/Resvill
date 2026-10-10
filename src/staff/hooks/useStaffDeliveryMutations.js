import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDelivery,
  assignDelivery,
  reassignDelivery,
} from "../services/staffService";

/**
 * Create a delivery.
 */
export const useCreateStaffDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deliveryData) => createDelivery(deliveryData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "orders"],
      });

      return data;
    },
  });
};


/**
 * Assign a driver to a delivery.
 */
export const useAssignStaffDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deliveryId, driverId }) =>
      assignDelivery(deliveryId, {
        driverId,
      }),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "drivers"],
      });

      if (variables?.deliveryId) {
        queryClient.invalidateQueries({
          queryKey: ["staff", "deliveries", variables.deliveryId],
        });
      }

      return data;
    },
  });
};


/**
 * Reassign a delivery to another driver.
 */
export const useReassignStaffDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deliveryId, driverId }) =>
      reassignDelivery(deliveryId, {
        driverId,
      }),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff", "drivers"],
      });

      if (variables?.deliveryId) {
        queryClient.invalidateQueries({
          queryKey: ["staff", "deliveries", variables.deliveryId],
        });
      }

      return data;
    },
  });
};
