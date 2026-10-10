import { useQuery } from "@tanstack/react-query";
import { getStaffOrderById } from "../services/staffService";

export const useStaffOrder = (orderId) => {
  return useQuery({
    queryKey: ["staff", "orders", orderId],
    queryFn: () => getStaffOrderById(orderId),
    enabled: Boolean(orderId),
    staleTime: 15 * 1000,
  });
};

