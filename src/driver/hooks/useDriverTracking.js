import { useQuery } from "@tanstack/react-query";
import { getDriverTracking } from "../services/driverService";

export const useDriverTracking = (options = {}) => {
  return useQuery({
    queryKey: ["driver", "tracking"],
    queryFn: getDriverTracking,
    staleTime: 10 * 1000,
    ...options,
  });
};

export default useDriverTracking;