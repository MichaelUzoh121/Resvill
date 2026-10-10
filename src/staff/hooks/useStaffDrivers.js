import { useQuery } from "@tanstack/react-query";
import { getAvailableDrivers } from "../services/staffService";

export const useStaffDrivers = (params = {}) => {
  return useQuery({
    queryKey: ["staff", "drivers", "available", params],
    queryFn: () => getAvailableDrivers(params),
    staleTime: 15 * 1000,
  });
};

