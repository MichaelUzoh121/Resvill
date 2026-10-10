import { useQuery } from "@tanstack/react-query";
import { getDriverActiveDeliveries } from "../services/driverService";

export const useDriverActiveDeliveries = (options = {}) => {
  return useQuery({
    queryKey: ["driver", "active-deliveries"],
    queryFn: getDriverActiveDeliveries,
    staleTime: 15 * 1000,
    ...options,
  });
};

export default useDriverActiveDeliveries;