import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "../services/adminService";

export const useAdminDashboard = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-dashboard", params],

    queryFn: () => getAdminDashboard(params),

    staleTime: 1000 * 60 * 2,

    ...options,
  });
};