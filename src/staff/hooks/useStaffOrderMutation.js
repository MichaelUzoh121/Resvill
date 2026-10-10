import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStaffOrderStatus } from "../services/staffService";

export const useStaffOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) =>
      updateStaffOrderStatus(orderId, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["staff", "orders"],
      });

      if (variables?.orderId) {
        queryClient.invalidateQueries({
          queryKey: ["staff", "orders", variables.orderId],
        });
      }
    },
  });
};

