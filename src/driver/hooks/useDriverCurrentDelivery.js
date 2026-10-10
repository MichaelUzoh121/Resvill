import { useQuery } from "@tanstack/react-query";
import { getDriverCurrentDelivery } from "../services/driverService";

export const useDriverCurrentDelivery = (options = {}) => {
  return useQuery({
    queryKey: ["driver", "current-delivery"],
    queryFn: getDriverCurrentDelivery,
    staleTime: 10 * 1000,
    ...options,
  });
};

export default useDriverCurrentDelivery;