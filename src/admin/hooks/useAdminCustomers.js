import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getAdminCustomers,
  getAdminCustomerDetails,
  updateAdminCustomerStatus,
} from "../services/adminService";

export const useAdminCustomers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admin-customers", params],
    queryFn: () => getAdminCustomers(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useAdminCustomerDetails = (
  customerId,
  options = {},
) => {
  return useQuery({
    queryKey: ["admin-customer", customerId],
    queryFn: () => getAdminCustomerDetails(customerId),
    enabled: Boolean(customerId),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useUpdateAdminCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, isActive }) =>
      updateAdminCustomerStatus(customerId, isActive),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-customer", variables.customerId],
      });
    },
  });
};