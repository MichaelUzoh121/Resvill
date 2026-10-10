import { useQuery } from "@tanstack/react-query";
import { getDriverDashboard } from "../services/driverService";

export const useDriverDashboard = (options = {}) => {
  return useQuery({
    queryKey: ["driver", "dashboard"],
    queryFn: getDriverDashboard,
    staleTime: 30 * 1000,
    ...options,
  });
};

export default useDriverDashboard;