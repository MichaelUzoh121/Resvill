import { useQuery } from "@tanstack/react-query";

import { getAdminAnalytics } from "../services/adminService";

export const useAdminAnalytics = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-analytics", params],
    queryFn: () => getAdminAnalytics(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};