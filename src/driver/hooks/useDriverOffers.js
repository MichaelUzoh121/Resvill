import { useQuery } from "@tanstack/react-query";
import { getDriverOffers } from "../services/driverService";

export const useDriverOffers = (options = {}) => {
  return useQuery({
    queryKey: ["driver", "offers"],
    queryFn: getDriverOffers,
    staleTime: 10 * 1000,
    ...options,
  });
};

export default useDriverOffers;