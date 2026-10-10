import { useQuery } from "@tanstack/react-query";
import { getDriverDeliveryHistory } from "../services/driverService";

export const useDriverHistory = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["driver", "history", params],
    queryFn: () => getDriverDeliveryHistory(params),
    staleTime: 30 * 1000,
    ...options,
  });
};

export default useDriverHistory;