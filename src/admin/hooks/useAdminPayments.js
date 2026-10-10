import { useQuery } from "@tanstack/react-query";

import { getAdminPayments } from "../services/adminService";

export const useAdminPayments = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-payments", params],
    queryFn: () => getAdminPayments(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};